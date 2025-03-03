from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_mail import Mail, Message
import os
import pdfplumber
import docx2txt
from flask_cors import CORS
from email.mime.text import MIMEText
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# ==========================
# 🚀 CONFIGURATIONS
# ==========================

# Database Configuration (SQLite)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'  # Stores Admins & Resumes
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Flask-JWT Configuration (Authentication)
app.config["JWT_SECRET_KEY"] = "your_secret_key"  # Change to a secure key
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Flask-Mail Configuration (for Email Notifications)
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "kirankm1711@gmail.com"
app.config["MAIL_PASSWORD"] = "ckzk xiyi qswi odzd"
app.config["MAIL_DEFAULT_SENDER"] = "your-email@gmail.com"
mail = Mail(app)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ==========================
# 📚 DATABASE MODELS
# ==========================

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    text = db.Column(db.Text, nullable=False)

# Create the database
with app.app_context():
    db.create_all()

# ==========================
# 📂 ADMIN SIGNUP
# ==========================

@app.route('/admin_signup', methods=['POST'])
def admin_signup():
    data = request.get_json()

    # Validate input
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({"success": False, "error": "Missing fields"}), 400

    # Check if email exists
    if Admin.query.filter_by(email=data['email']).first():
        return jsonify({"success": False, "error": "Email already exists"}), 400

    # Hash password before saving
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # Save to database
    new_admin = Admin(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({"success": True, "message": "Admin registered successfully"}), 201

# ==========================
# 📂 ADMIN LOGIN
# ==========================

@app.route("/admin_login", methods=["POST"])
def admin_login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    admin = Admin.query.filter_by(username=username).first()
    
    if admin and bcrypt.check_password_hash(admin.password, password):
        access_token = create_access_token(identity=username)
        return jsonify({"message": "Login successful!", "token": access_token})
    else:
        return jsonify({"message": "Invalid username or password"}), 401

# ==========================
# 💼 ADMIN DASHBOARD (PROTECTED)
# ==========================

@app.route("/admin_dashboard", methods=["GET"])
@jwt_required()
def admin_dashboard():
    resumes = Resume.query.all()
    resume_list = [{"filename": r.filename, "text": r.text} for r in resumes]
    return jsonify(resume_list)

# ==========================
# 📝 TEXT EXTRACTION FROM RESUME
# ==========================

def extract_text(file_path):
    if file_path.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            text = "".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    elif file_path.endswith(".docx"):
        text = docx2txt.process(file_path)
    else:
        text = "Unsupported file format"
    return text

# ==========================
# 📂 RESUME UPLOAD & STORAGE IN SQLite
# ==========================

@app.route('/upload', methods=['POST'])
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({"message": "No file provided"}), 400

    file = request.files['resume']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    extracted_text = extract_text(file_path)

    # Store in database
    new_resume = Resume(filename=file.filename, text=extracted_text)
    db.session.add(new_resume)
    db.session.commit()

    return jsonify({"message": "Resume uploaded successfully!", "extracted_text": extracted_text})

# ==========================
# 📂 GET ALL RESUMES
# ==========================

@app.route('/get_resumes', methods=['GET'])
def get_resumes():
    resumes = Resume.query.all()
    return jsonify([{"filename": r.filename, "text": r.text} for r in resumes])

# ==========================
# 📊 RANK RESUMES
# ==========================

@app.route('/rank_resumes', methods=['POST'])
def rank_resumes():
    data = request.json
    job_description = data.get("job_description", "")
    resumes = data.get("resumes", [])

    if not job_description or not resumes:
        return jsonify({"error": "Job description and resumes are required"}), 400

    # Combine job description with resumes
    documents = [job_description] + resumes
    vectorizer = TfidfVectorizer().fit_transform(documents)
    vectors = vectorizer.toarray()

    # Calculate cosine similarity
    job_description_vector = vectors[0].reshape(1, -1)
    resume_vectors = vectors[1:]

    cosine_similarities = cosine_similarity(job_description_vector, resume_vectors).flatten()
    
    ranked_candidates = [{"name": f"Candidate {i+1}", "score": round(score * 100, 2)} for i, score in enumerate(cosine_similarities)]
    ranked_candidates.sort(key=lambda x: x["score"], reverse=True)

    return jsonify({"ranked_candidates": ranked_candidates})

# ==========================
# ✉️ EMAIL NOTIFICATION
# ==========================

def send_email(recipient, subject, body):
    msg = Message(subject, recipients=[recipient], body=body)
    mail.send(msg)

@app.route("/send_email", methods=["POST"])
def send_email_route():
    data = request.json
    recipient_email = data.get("email")
    message_text = data.get("message")

    if not recipient_email or not message_text:
        return jsonify({"error": "Missing email or message"}), 400

    try:
        msg = Message("Resume Processing Update", recipients=[recipient_email])
        msg.body = message_text
        mail.send(msg)

        return jsonify({"message": "Email sent successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================
# 🚀 RUN FLASK APP
# ==========================

if __name__ == "__main__":
    app.run(debug=True)
