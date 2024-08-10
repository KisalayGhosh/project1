from email.mime.text import MIMEText
from smtplib import SMTP

def test_email():
    smtp_host = 'localhost'
    smtp_port = 1025
    sender_email = 'your_email@example.com'
    recipient_email = 'recipient@example.com'

    msg = MIMEText('This is a test email.')
    msg['Subject'] = 'Test Email'
    msg['From'] = sender_email
    msg['To'] = recipient_email

    with SMTP(smtp_host, smtp_port) as server:
        server.sendmail(sender_email, recipient_email, msg.as_string())

test_email()
