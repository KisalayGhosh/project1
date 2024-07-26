from flask import current_app as app, render_template, jsonify, request
from flask_security import auth_required, roles_required
from application.models import User, db, Section, Request, Feedback, IssuedEbook,Ebook
from werkzeug.security import check_password_hash
from application.resources import RequestResource, FeedbackResource, IssuedEbookResource, SectionResource
from main import datastore
from datetime import datetime
from flask_security import current_user

@app.get('/')
def home():
    return render_template("index.html")

@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return "Hello Admin"

# API for user login
@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "Email not provided"}), 400

    user = datastore.find_user(email=email)
    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Wrong Password"}), 400

# API for user logout
@app.post('/logout')
@auth_required("token")
def logout():
    token = request.headers.get('Authentication-Token')
    if token:
        datastore.delete_token(token)
        return jsonify({"message": "Successfully logged out"}), 200
    return jsonify({"message": "Token not provided"}), 400

# API for fetching section details and displaying on card in admin dashboard
# Example endpoints for managing sections
@app.get('/sections-details')
def get_sections_details():
    sections = Section.query.all()
    section_details = [
        {
            'section_id': section.section_id,
            'section_name': section.section_name,
            'description': section.description,
            'created_at': section.created_at,
            'updated_at': section.updated_at
        }
        for section in sections
    ]
    return jsonify(section_details)

@app.post('/sections')
# @auth_required("token")
# @roles_required("admin", "librarian")
def create_section():
    data = request.get_json()
    section_name = data.get('section_name')
    description = data.get('description')

    if not section_name:
        return jsonify({"message": "Section name is required"}), 400

    new_section = Section(
        section_name=section_name,
        description=description,
        created_at=datetime.utcnow()
    )
    db.session.add(new_section)
    db.session.commit()

    return jsonify({
        "message": "Section created successfully",
        "section": {
            'section_id': new_section.section_id,
            'section_name': new_section.section_name,
            'description': new_section.description,
            'created_at': new_section.created_at,
            'updated_at': new_section.updated_at
        }
    }), 201

@app.put('/sections/<int:section_id>')
# @auth_required("token")
# @roles_required("admin", "librarian")
def update_section(section_id):
    data = request.get_json()
    section = Section.query.get(section_id)
    if section:
        section.section_name = data.get('section_name', section.section_name)
        section.description = data.get('description', section.description)
        section.updated_at = datetime.utcnow()
        db.session.commit()
        return jsonify({"message": "Section updated successfully"}), 200
    return jsonify({"message": "Section not found"}), 404

@app.delete('/sections/<int:section_id>')
# @auth_required("token")
# @roles_required("admin", "librarian")
def delete_section(section_id):
    section = Section.query.get(section_id)
    if section:
        # Delete all associated ebooks
        Ebook.query.filter_by(section_id=section_id).delete()
        
        db.session.delete(section)
        db.session.commit()
        return jsonify({"message": "Section and associated ebooks deleted successfully"}), 200
    return jsonify({"message": "Section not found"}), 404


# Using Resource classes for handling complex API endpoints
@app.get('/sections')
@auth_required("token")
@roles_required("admin", "librarian", "user")
def get_sections():
    return SectionResource.get()



#API for aadding ebook a card/secttion
@app.post('/sections/<int:section_id>/ebooks')
# @auth_required("token")
# @roles_required("admin", "librarian")
def add_ebook_to_section(section_id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    author = data.get('author')

    if not (title and content and author):
        return jsonify({"message": "Title, content, and author are required"}), 400

    section = Section.query.get(section_id)
    if not section:
        return jsonify({"message": "Section not found"}), 404

    admin_user = User.query.filter_by(email='admin@email.com').first()  # Replace with actual admin user retrieval logic

    new_ebook = Ebook(
        title=title,
        content=content,
        author=author,
        section=section,
        user=admin_user,
        created_at=datetime.utcnow()
    )

    db.session.add(new_ebook)
    db.session.commit()

    return jsonify({
        "message": "Ebook added to section successfully",
        "ebook": {
            'ebook_id': new_ebook.ebook_id,
            'title': new_ebook.title,
            'content': new_ebook.content,
            'author': new_ebook.author,
            'section_id': new_ebook.section.section_id,
            'created_at': new_ebook.created_at
        }
    }), 201
    
    
#fetching ebook details after clicking card    
@app.get('/sections/<int:section_id>/ebooks')
def get_ebooks_by_section(section_id):
    section = Section.query.get(section_id)
    if not section:
        return jsonify({"message": "Section not found"}), 404
    
    ebooks = Ebook.query.filter_by(section_id=section_id).all()
    ebook_list = [
        {
            'id': ebook.ebook_id,
            'title': ebook.title,
            'author': ebook.author,
            'content': ebook.content
        }
        for ebook in ebooks
    ]
    return jsonify({"ebooks": ebook_list, "section_name": section.section_name})
    


#Issued ebook related to the logged in user
@app.route('/api/issued-books', methods=['GET'])
@auth_required('token')
def get_issued_books():
    user_id = current_user.id
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    issued_books = IssuedEbook.query.filter_by(user_id=user_id).all()
    books_info = []

    for issued in issued_books:
        book = Ebook.query.get(issued.ebook_id)
        if book:
            books_info.append({
                "id": book.ebook_id,
                "title": book.title,
                "author": book.author,
                "section": book.section.section_name,
                "issuedDate": issued.issue_date.strftime("%Y-%m-%d"),
                "returnDate": issued.return_date.strftime("%Y-%m-%d"),
                "content": book.content
            })

    return jsonify(books_info)



@app.route('/requests', methods=['GET'])
# @auth_required('token')
def get_requests():
    requests = Request.query.all()
    request_data = []
    for req in requests:
        request_data.append({
            'request_id': req.request_id,
            'user': {
                'id': req.user.id,
                'email': req.user.email
            },
            'ebook': {
                'ebook_id': req.ebook.ebook_id,
                'title': req.ebook.title,
                'author': req.ebook.author,
                'section': {
                    'section_id': req.ebook.section.section_id,
                    'section_name': req.ebook.section.section_name
                }
            },
            'request_date': req.request_date,
            'status': req.status
        })
    return jsonify(request_data)

@app.route('/requests/<int:request_id>/grant', methods=['POST'])
# @auth_required('token')
def grant_request(request_id):
    req = Request.query.get(request_id)
    if req:
        req.status = 'granted'
        db.session.commit()
        return jsonify({'message': 'Request granted.'}), 200
    return jsonify({'error': 'Request not found.'}), 404

@app.route('/requests/<int:request_id>/revoke', methods=['POST'])
# @auth_required('token')
def revoke_request(request_id):
    req = Request.query.get(request_id)
    if req:
        req.status = 'revoked'
        db.session.commit()
        return jsonify({'message': 'Request revoked.'}), 200
    return jsonify({'error': 'Request not found.'}), 404




@app.get('/feedback')
@auth_required("token")
@roles_required("admin", "librarian", "user")
def get_feedback():
    feedbacks = Feedback.query.all()
    feedback_details = [
        {
            'feedback_id': feedback.feedback_id,
            'user': {
                'id': feedback.user.id,
                'username': feedback.user.username,
                'email': feedback.user.email
            },
            'ebook': {
                'id': feedback.ebook.ebook_id,
                'title': feedback.ebook.title
            },
            'rating': feedback.rating,
            'comment': feedback.comment,
            'created_at': feedback.created_at
        }
        for feedback in feedbacks
    ]
    return jsonify(feedback_details)

# API for creating feedback
@app.post('/feedback')
@auth_required("token")
@roles_required("admin", "librarian", "user")
def create_feedback():
    data = request.get_json()
    user_id = data.get('user_id')
    ebook_id = data.get('ebook_id')
    rating = data.get('rating')
    comment = data.get('comment')

    if not (user_id and ebook_id and rating):
        return jsonify({"message": "User ID, Ebook ID, and Rating are required"}), 400

    new_feedback = Feedback(
        user_id=user_id,
        ebook_id=ebook_id,
        rating=rating,
        comment=comment
    )

    db.session.add(new_feedback)
    db.session.commit()

    return jsonify({
        "message": "Feedback created successfully",
        "feedback": {
            'feedback_id': new_feedback.feedback_id,
            'user_id': new_feedback.user_id,
            'ebook_id': new_feedback.ebook_id,
            'rating': new_feedback.rating,
            'comment': new_feedback.comment,
            'created_at': new_feedback.created_at
        }
    }), 201




@app.get('/issued_ebooks')
@auth_required("token")
@roles_required("admin", "librarian")
def get_issued_ebooks():
    issued_ebooks = IssuedEbook.query.all()
    issued_ebook_details = [
        {
            'issue_id': issued_ebook.issue_id,
            'user': {
                'id': issued_ebook.user.id,
                'username': issued_ebook.user.username,
                'email': issued_ebook.user.email
            },
            'ebook': {
                'id': issued_ebook.ebook.ebook_id,
                'title': issued_ebook.ebook.title
            },
            'issue_date': issued_ebook.issue_date,
            'return_date': issued_ebook.return_date,
            'status': issued_ebook.status,
            'created_at': issued_ebook.created_at
        }
        for issued_ebook in issued_ebooks
    ]
    return jsonify(issued_ebook_details)

# API for creating issued ebook
@app.post('/issued_ebooks')
@auth_required("token")
@roles_required("admin", "librarian")
def create_issued_ebook():
    data = request.get_json()
    user_id = data.get('user_id')
    ebook_id = data.get('ebook_id')
    issue_date = data.get('issue_date')
    return_date = data.get('return_date')
    status = data.get('status')

    if not (user_id and ebook_id and issue_date and status):
        return jsonify({"message": "User ID, Ebook ID, Issue Date, and Status are required"}), 400

    new_issued_ebook = IssuedEbook(
        user_id=user_id,
        ebook_id=ebook_id,
        issue_date=issue_date,
        return_date=return_date,
        status=status
    )

    db.session.add(new_issued_ebook)
    db.session.commit()

    return jsonify({
        "message": "Issued Ebook created successfully",
        "issued_ebook": {
            'issue_id': new_issued_ebook.issue_id,
            'user_id': new_issued_ebook.user_id,
            'ebook_id': new_issued_ebook.ebook_id,
            'issue_date': new_issued_ebook.issue_date,
            'return_date': new_issued_ebook.return_date,
            'status': new_issued_ebook.status,
            'created_at': new_issued_ebook.created_at
        }
    }), 201