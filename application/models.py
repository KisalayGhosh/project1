from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String, unique=False)
    user_email = db.Column(db.String, unique=True)
    user_password = db.Column(db.String(1000))
    user_active_status = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(1000), unique=True, nullable=False)
    user_role_id= db.Column(db.String, db.ForeignKey('role.role_id'))
    user_role=db.Relationship('Role')

class Role(db.Model):
    role_id = db.Column(db.String, primary_key=True)
    role_name = db.Column(db.String(1000), unique=True)
    role_description = db.Column(db.String(1000))