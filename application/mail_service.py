from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = '21f1003331@ds.study.iitm.ac.in'  

def send_email(to, subject, content_body):
    
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to
    msg['Subject'] = subject

    
    msg.attach(MIMEText(content_body, 'html'))

    
    with SMTP(host=SMTP_HOST, port=SMTP_PORT) as server:
        server.send_message(msg)

def send_alert(message):
    
    print(message)
