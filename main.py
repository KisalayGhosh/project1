from flask import Flask
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from flask_security import SQLAlchemyUserDatastore, Security
from application.celery import make_celery

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    
    # Initialize Flask-Security
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    
    with app.app_context():
        import application.views

    celery = make_celery(app)
    
    return app, datastore, celery

app, datastore, celery = create_app()

if __name__ == '__main__':
    app.run(debug=True)
