from main import app
from application.models import db, Role

with app.app_context():
    db.create_all()