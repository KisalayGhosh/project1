from flask import current_app as app, render_template, jsonify, request, send_file
from flask_security import auth_required, roles_required, current_user
from application.models import User, db
from werkzeug.security import check_password_hash
from flask_restful import marshal, fields
from application.resources import SectionResource, RequestResource, FeedbackResource, IssuedEbookResource
from main import datastore



@app.get('/')
def home():
    return render_template("index.html")

@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return "Hello Admin"

@app.get('/user-login')
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




@app.get('/sections')
@auth_required("token")
@roles_required("admin", "librarian", "user")
def get_sections():
    return SectionResource.get()

@app.post('/sections')
@auth_required("token")
@roles_required("admin", "librarian")
def create_section():
    return SectionResource.post()

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
