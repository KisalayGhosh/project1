from flask import Flask
from application.models import db
from config import DevelopmentConfig



def create_app():
    app = Flask(__name__)
    db.init_app(app)
    app.config.from_object(DevelopmentConfig)
    with app.app_context():
        import application.views
        
    return app

app=create_app()

if __name__ == '__main__':
    app.run(debug=True)