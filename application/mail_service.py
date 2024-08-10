from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = '21f1003331@ds.study.iitm.ac.in'  # Update this to your sender email

def send_email(to, subject, content_body):
    # Create a multipart message and set headers
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to
    msg['Subject'] = subject

    # Add body to email
    msg.attach(MIMEText(content_body, 'html'))

    # Connect to the SMTP server and send the email
    with SMTP(host=SMTP_HOST, port=SMTP_PORT) as server:
        server.send_message(msg)

def send_alert(message):
    # Example implementation for sending alerts (you might use a different method)
    print(message)
