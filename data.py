from datetime import datetime
from application.models import db, User, Role, Section, Ebook, Request, Feedback, IssuedEbook
from werkzeug.security import generate_password_hash
from flask_security import SQLAlchemyUserDatastore
from flask import Flask
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from flask_security import SQLAlchemyUserDatastore, Security

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    datastore=SQLAlchemyUserDatastore(db, User, Role)
    app.security=Security(app, datastore)
    with app.app_context():
        import application.views
        
    return app, datastore

app, datastore =create_app()
def populate_data():
    """
    Populate initial data into the database.
    """
    try:
       
        db.create_all()

       
        admin_role = Role.query.filter_by(name='admin').first()
        librarian_role = Role.query.filter_by(name='librarian').first()
        user_role = Role.query.filter_by(name='user').first()

        
        if not admin_role:
            admin_role = Role(name='admin', description='Administrator role')
            db.session.add(admin_role)
        if not librarian_role:
            librarian_role = Role(name='librarian', description='Librarian role')
            db.session.add(librarian_role)
        if not user_role:
            user_role = Role(name='user', description='General user role')
            db.session.add(user_role)

        db.session.commit()

        
        datastore = SQLAlchemyUserDatastore(db, User, Role)

        if not User.query.filter_by(email='admin@email.com').first():
            admin_user = datastore.create_user(
                email='admin@email.com',
                password=generate_password_hash('admin'),
                roles=[admin_role]
            )
        if not User.query.filter_by(email='librarian@email.com').first():
            librarian_user = datastore.create_user(
                email='librarian@email.com',
                password=generate_password_hash('librarian'),
                roles=[librarian_role]
            )
        if not User.query.filter_by(email='user1@email.com').first():
            user1 = datastore.create_user(
                email='user1@email.com',
                password=generate_password_hash('user1'),
                roles=[user_role]
            )
        if not User.query.filter_by(email='user2@email.com').first():
            user2 = datastore.create_user(
                email='user2@email.com',
                password=generate_password_hash('user2'),
                roles=[user_role]
            )

        db.session.commit()

      
        if not Section.query.filter_by(section_name='Science').first():
            section1 = Section(section_name='Science', description='Books related to science')
            db.session.add(section1)
        if not Section.query.filter_by(section_name='Philosophy').first():
            section2 = Section(section_name='Philosophy', description='Books related to philosophy')
            db.session.add(section2)

        db.session.commit()

      
        admin_user = User.query.filter_by(email='admin@email.com').first()

        if not Ebook.query.filter_by(title='Introduction to Physics').first():
            ebook1 = Ebook(title='Introduction to Physics', content='...', author='John Doe', user=admin_user, created_at=datetime.utcnow())
            db.session.add(ebook1)
            db.session.commit()  
        if not Ebook.query.filter_by(title='Meditations').first():
            ebook2 = Ebook(title='Meditations', content='...', author='Marcus Aurelius', user=admin_user, created_at=datetime.utcnow())
            db.session.add(ebook2)
            db.session.commit()  


    except Exception as e:
        db.session.rollback()
        print(f"An error occurred: {e}")
    finally:
        db.session.close()


if __name__ == '__main__':
    with app.app_context():
        
        populate_data()
