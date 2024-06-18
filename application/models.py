from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String, unique=False)
    user_email = db.Column(db.String, unique=True)
    user_password = db.Column(db.String(1000))
    user_active_status = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(1000), unique=True, nullable=False)
    user_role_id= db.Column(db.String, db.ForeignKey('role.role_id'))
    user_role=db.relationship('Role')
    # user_study_resource = db.relationship('StudyResource', backref='creator')

class Role(db.Model):
    role_id = db.Column(db.String, primary_key=True)
    role_name = db.Column(db.String(1000), unique=True)
    role_description = db.Column(db.String(1000))

class StudyResource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    # creator_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    resource_link = db.Column(db.String, nullable=False)
    is_approved = db.Column(db.Boolean(), default=False)






class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(64), unique=True, nullable=False)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    role = db.relationship('Role', back_populates='user')



class Section(db.Model):
    __tablename__ = 'sections'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Section {self.name}>'

class Ebook(db.Model):
    __tablename__ = 'ebooks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(64), nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey('sections.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    section = db.relationship('Section', back_populates='ebooks')

    def __repr__(self):
        return f'<Ebook {self.title}>'

Section.ebooks = db.relationship('Ebook', order_by=Ebook.id, back_populates='section')

class Request(db.Model):
    __tablename__ = 'requests'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ebook_id = db.Column(db.Integer, db.ForeignKey('ebooks.id'), nullable=False)
    request_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(64), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = db.relationship('User', back_populates='requests')
    ebook = db.relationship('Ebook', back_populates='requests')

    def __repr__(self):
        return f'<Request {self.id} - Status: {self.status}>'

User.requests = db.relationship('Request', order_by=Request.id, back_populates='user')
Ebook.requests = db.relationship('Request', order_by=Request.id, back_populates='ebook')

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ebook_id = db.Column(db.Integer, db.ForeignKey('ebooks.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', back_populates='feedback')
    ebook = db.relationship('Ebook', back_populates='feedback')

    def __repr__(self):
        return f'<Feedback {self.id} - Rating: {self.rating}>'

User.feedback = db.relationship('Feedback', order_by=Feedback.id, back_populates='user')
Ebook.feedback = db.relationship('Feedback', order_by=Feedback.id, back_populates='ebook')

class IssuedEbook(db.Model):
    __tablename__ = 'issued_ebooks'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ebook_id = db.Column(db.Integer, db.ForeignKey('ebooks.id'), nullable=False)
    issue_date = db.Column(db.DateTime, default=datetime.utcnow)
    return_date = db.Column(db.DateTime)
    status = db.Column(db.String(64), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', back_populates='issued_ebooks')
    ebook = db.relationship('Ebook', back_populates='issued_ebooks')

    def __repr__(self):
        return f'<IssuedEbook {self.id} - Status: {self.status}>'

User.issued_ebooks = db.relationship('IssuedEbook', order_by=IssuedEbook.id, back_populates='user')
Ebook.issued_ebooks = db.relationship('IssuedEbook', order_by=IssuedEbook.id, back_populates='ebook')