from celery import Celery
from flask import render_template
from application.models import User, Ebook, Section, Feedback
from application.mail_service import send_email, send_alert
from datetime import datetime
import csv
import os
from main import celery

@celery.task
def send_daily_reminders():
    users = User.query.all()
    for user in users:
        if user_needs_reminder(user):
            send_reminder(user)

def user_needs_reminder(user):
    last_visit = user.last_visit
    approaching_books = [
        book for book in user.issued_books if (book.return_date - datetime.now()).days <= 2
    ]
    return not last_visit or approaching_books

def send_reminder(user):
    send_email(
        to=user.email,
        subject="Reminder: Please visit or return your books",
        content_body=f"Dear {user.username},<br><br> You have pending books to return. Please visit the library or return the books soon."
    )

@celery.task
def send_monthly_report():
    sections = Section.query.all()
    issued_ebooks = Ebook.query.filter_by(is_issued=True).all()
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
    with open(csv_file, 'w', newline='') as csvfile:
        fieldnames = ['Title', 'Content', 'Author(s)', 'Date Issued', 'Return Date']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for ebook in ebooks:
            writer.writerow({
                'Title': ebook.title,
                'Content': ebook.content,
                'Author(s)': ', '.join([author.name for author in ebook.authors]),
                'Date Issued': ebook.date_issued,
                'Return Date': ebook.return_date,
            })
    send_alert("CSV export completed. You can download it now.")
