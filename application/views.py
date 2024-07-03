from flask import current_app as app, render_template
from flask_security import auth_required, roles_required 

@app.get('/')
def home():
    return render_template("index.html")


@app.get('/admininfo')
@auth_required("token")
@roles_required("admin")
def admininfo():
    return "Nice to have yoy back on th epage Admin!!"
