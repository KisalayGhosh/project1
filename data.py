from main import app
from application.models import db, Role

with app.app_context():
    db.create_all()
    admin= Role(role_id='admin', role_name='Admin', role_description='Admin description')
    db.session.add(admin)
    
    stud=Role(role_id='stud', role_name='Student', role_description='Student description')
    db.session.add(stud)
    
    inst= Role(role_id='inst', role_name='Instructor', role_description='Instructor description')
    db.session.add(inst)
    try:
        db.session.commit()
    except:
        pass    
    
    