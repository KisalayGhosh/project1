from flask import current_app as app, render_template, jsonify, request, send_file
from flask_security import auth_required, roles_required, current_user
from application.models import User, db
from werkzeug.security import check_password_hash
from flask_restful import marshal, fields
from application.resources import RequestResource, FeedbackResource, IssuedEbookResource
from main import datastore
from application.models import Section



@app.get('/')
def home():
    return render_template("index.html")

@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return "Hello Admin"

@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400

   
    user = datastore.find_user(email=email)
    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Wrong Password"}), 400


@app.route('/logout', methods=['POST'])
@auth_required("token")
def logout():
    token = request.headers.get('Authentication-Token')
    if token:
        datastore.delete_token(token)
        return jsonify({"message": "Successfully logged out"}), 200
    return jsonify({"message": "Token not provided"}), 400


@app.route('/sections-details', methods=['GET'])
def get_sections_details():
    sections = Section.query.all()
    section_details = []
    for section in sections:
        section_info = {
            'section_name': section.section_name,
            'description': section.description,
            'created_at': section.created_at,
            'updated_at': section.updated_at
        }
        section_details.append(section_info)
    return jsonify(section_details)


@app.route('/sections', methods=['POST'])
@auth_required("token")  # Adjust as per your authentication requirement
@roles_required("admin", "librarian")  # Adjust as per your role requirement
def create_section():
    data = request.get_json()
    section_name = data.get('section_name')
    description = data.get('description')
    
    if not section_name:
        return jsonify({"message": "Section name is required"}), 400

    new_section = Section(section_name=section_name, description=description, created_at=datetime.utcnow())
    db.session.add(new_section)
    db.session.commit()
    
    return jsonify({"message": "Section created successfully", "section": {
        'id': new_section.id,
        'section_name': new_section.section_name,
        'description': new_section.description,
        'created_at': new_section.created_at,
        'updated_at': new_section.updated_at
    }}), 201




# @app.get('/sections')
# @auth_required("token")
# @roles_required("admin", "librarian", "user")
# def get_sections():
#     return SectionResource.get()

# @app.post('/sections')
# @auth_required("token")
# @roles_required("admin", "librarian")
# def create_section():
#     return SectionResource.post()

@app.get('/requests')
@auth_required("token")
@roles_required("admin", "librarian", "user")
def get_requests():
    return RequestResource.get()

@app.post('/requests')
@auth_required("token")
@roles_required("admin", "librarian", "user")
def create_request():
    return RequestResource.post()

@app.get('/feedback')
@auth_required("token")
@roles_required("admin", "librarian", "user")
def get_feedback():
    return FeedbackResource.get()

@app.post('/feedback')
@auth_required("token")
@roles_required("admin", "librarian", "user")
def create_feedback():
    return FeedbackResource.post()

@app.get('/issued_ebooks')
@auth_required("token")
@roles_required("admin", "librarian")
def get_issued_ebooks():
    return IssuedEbookResource.get()

@app.post('/issued_ebooks')
@auth_required("token")
@roles_required("admin", "librarian")
def create_issued_ebook():
    return IssuedEbookResource.post()
