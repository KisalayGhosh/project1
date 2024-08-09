import smtplib
from email.mime.text import MIMEText
from flask import current_app

def send_message(to_email, subject, body):
    sender_email = current_app.config['MAIL_SENDER_EMAIL']
    sender_password = current_app.config['MAIL_SENDER_PASSWORD']
    smtp_server = current_app.config['MAIL_SERVER']
    smtp_port = current_app.config['MAIL_PORT']

    msg = MIMEText(body, 'html')
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = to_email

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)

    return "Email sent successfully"
