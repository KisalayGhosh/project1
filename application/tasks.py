from celery import Celery
from flask import render_template
from application.models import User, Ebook, Section, Feedback, IssuedEbook
from application.mail_service import send_email, send_alert
from datetime import datetime
import csv
import os
from main import celery
from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

@celery.task
def send_daily_reminders():
    issued_books = IssuedEbook.query.all()
    for issued_book in issued_books:
        if user_needs_reminder(issued_book):
            send_email()

def user_needs_reminder(issued_book):
    days_until_due = (issued_book.return_date - datetime.now()).days
    return days_until_due <= 2

def send_email(to, subject, content_body):
    smtp_host = 'localhost'
    smtp_port = 1025
    sender_email = '21f1003331@ds.study.iitm.ac.in'

    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to
    msg['Subject'] = subject

    
    msg.attach(MIMEText(content_body, 'html'))

   
    with SMTP(smtp_host, smtp_port) as server:
        server.sendmail(sender_email, to, msg.as_string())




@celery.task
@celery.task
def send_monthly_report():
    sections = Section.query.all()
    issued_ebooks = IssuedEbook.query.all()  
    feedbacks = Feedback.query.all()
    
    html_content = render_template(
        'monthly_report.html', 
        sections=sections, 
        issued_ebooks=issued_ebooks, 
        feedbacks=feedbacks
    )
    send_email(
        to='librarian@example.com',  
        subject="Monthly Activity Report",
        content_body=html_content
    )


@celery.task
def export_csv_report():
    ebooks = Ebook.query.all()
    csv_file = os.path.join('exports', 'issued_ebooks_report.csv')
    os.makedirs(os.path.dirname(csv_file), exist_ok=True)  
    with open(csv_file, 'w', newline='') as csvfile:
        fieldnames = ['Title', 'Content', 'Author', 'Date Issued', 'Return Date']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for ebook in ebooks:
            writer.writerow({
                'Title': ebook.title,
                'Content': ebook.content,
                'Author': ebook.author,  
                
            })
    send_alert("CSV export completed. You can download it now.")

