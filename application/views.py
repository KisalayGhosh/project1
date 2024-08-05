from flask import current_app as app, render_template, jsonify, request
from flask_security import auth_required, roles_required
from application.models import User, db, Section, Request, Feedback, IssuedEbook,Ebook
from werkzeug.security import check_password_hash
from application.resources import RequestResource, FeedbackResource, IssuedEbookResource, SectionResource
from main import datastore
from datetime import datetime, timedelta
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


#api for getting user id that is being used in feedback in user dashboard
@app.route('/api/user-id', methods=['GET'])
@auth_required('token')
def get_user_id():
    user_id = current_user.id
    return jsonify({"user_id": user_id})


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


#api for creating new section in admin dashboard
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



#Api for modifying a section in admin dashboard
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



#Api for deleting a section
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



#API for aadding ebook a card/secttion for admin
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

    admin_user = User.query.filter_by(email='admin@email.com').first()  

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
    
    
#api fetching ebook details after clicking card  for admin  
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
    


#api for Issued ebook related to the logged in user in user dashboard
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



#api for posting feeback of an ebook that is issued for a particular user
@app.route('/api/feedback', methods=['POST'])
@auth_required('token')
def submit_feedback():
    data = request.get_json()
    user_id = current_user.id
    ebook_id = data.get('ebookId')
    rating = data.get('rating')
    comment = data.get('comment')

    if not all([ebook_id, rating, comment]):
        return jsonify({"error": "Missing data"}), 400

    feedback = Feedback(
        user_id=user_id,
        ebook_id=ebook_id,
        rating=rating,
        comment=comment,
        created_at=datetime.utcnow()
    )
    db.session.add(feedback)
    db.session.commit()

@app.route('/api/feedbacks', methods=['GET'])
def get_all_feedbacks():
    feedbacks = Feedback.query.all()
    feedback_list = []
    for feedback in feedbacks:
        ebook = Ebook.query.get(feedback.ebook_id)
        user = User.query.get(feedback.user_id)
        feedback_list.append({
            'feedback_id': feedback.feedback_id,
            'user_id': feedback.user_id,
            'user_email': user.email if user else 'Unknown',
            'ebook_id': feedback.ebook_id,
            'ebook_title': ebook.title if ebook else 'Unknown',
            'rating': feedback.rating,
            'comment': feedback.comment,
            'created_at': feedback.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    return jsonify(feedback_list)

@app.route('/api/feedbacks/<int:feedback_id>', methods=['DELETE'])
# @auth_required('token')
# @roles_required('admin', 'librarian')
def delete_feedback(feedback_id):
    feedback = Feedback.query.get(feedback_id)
    if feedback:
        db.session.delete(feedback)
        db.session.commit()
        return jsonify({"message": "Feedback deleted successfully"}), 200
    return jsonify({"message": "Feedback not found"}), 404



@app.route('/requests', methods=['GET'])
@roles_required('admin')
def get_requests():
    requests = Request.query.all()
    return jsonify([r.to_dict() for r in requests])

@app.route('/requests', methods=['POST'])
@auth_required('token')
def create_request():
    data = request.get_json()
    ebook_id = data.get('ebook_id')

    if not ebook_id:
        return jsonify({"error": "ebook_id is required"}), 400

    ebook = Ebook.query.get(ebook_id)
    if not ebook:
        return jsonify({"error": "Ebook not found"}), 404

    user_id = current_user.id  # Ensure user_id is fetched correctly

    # Create and save the request
    new_request = Request(user_id=user_id, ebook_id=ebook_id, status='pending')
    db.session.add(new_request)
    db.session.commit()

    return jsonify({"message": "Request created successfully", "request_id": new_request.request_id}), 201

@app.route('/requests/<int:request_id>/grant', methods=['PUT'])
@roles_required('admin')
def grant_request(request_id):
    req = Request.query.get_or_404(request_id)
    if req.status != 'pending':
        return jsonify({'message': 'Request cannot be granted'}), 400

    req.status = 'issued'
    db.session.commit()

    issued_ebook = IssuedEbook(
        user_id=req.user_id,
        ebook_id=req.ebook_id,
        issue_date=datetime.utcnow(),
        return_date=datetime.utcnow() + timedelta(days=30),
        status='issued'
    )
    db.session.add(issued_ebook)
    db.session.commit()

    return jsonify(req.to_dict())

@app.route('/requests/<int:request_id>/revoke', methods=['PUT'])
@roles_required('admin')
def revoke_request(request_id):
    req = Request.query.get_or_404(request_id)
    if req.status != 'pending':
        return jsonify({'message': 'Request cannot be revoked'}), 400

    req.status = 'revoked'
    db.session.commit()
    return jsonify(req.to_dict())









