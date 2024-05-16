from flask import current_app as app, render_template

@app.get('/')
def home():
    return render_template("index.html")