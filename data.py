from main import app, datastore
from application.models import db, Role

with app.app_context():
    db.create_all()
    """librarian= Role(role_id=1, role_name='librarian')
    db.session.add(librarian)
    
    admin=Role(role_id=2, role_name='admin')
    db.session.add(admin)
    
    user= Role(role_id=3, role_name='user')
    db.session.add(user)
    try:
        db.session.commit()
    except:
        pass    
    
    """
    datastore.find_or_create_role(role_name="kisalay", description="User is a admin")
    db.session.commit()
    if not datastore.find_user(email="kisalay.ghsh20027@gmail.com"):
        datastore.create_user()
