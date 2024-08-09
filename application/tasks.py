from celery import shared_task
from datetime import datetime, timedelta
from flask import current_app
from jinja2 import Template
from application.models import db, User, IssuedEbook, Feedback, Section
from .mail_service import send_message
import flask_excel as excel





@shared_task
def send_daily_reminders():
    users_with_due_books = IssuedEbook.query.filter(
        IssuedEbook.return_date <= datetime.utcnow() + timedelta(days=2),
        IssuedEbook.status == 'issued'
    ).all()

    for issued_ebook in users_with_due_books:
        user = User.query.get(issued_ebook.user_id)
        message = f"Dear {user.username}, please remember to return the book '{issued_ebook.ebook.title}' by {issued_ebook.return_date}."
        
        send_message(user.email, "Library Return Reminder", message)
        # Add additional code here for sending via Google Chat Webhook or SMS if needed

    return "Reminders sent successfully"

@shared_task
def send_monthly_activity_report():
    librarian = User.query.join(User.roles).filter_by(name='librarian').first()
    sections = Section.query.all()
    issued_ebooks = IssuedEbook.query.filter(
        IssuedEbook.issue_date >= datetime.utcnow().replace(day=1),
        IssuedEbook.status == 'issued'
    ).all()
    feedbacks = Feedback.query.filter(
        Feedback.created_at >= datetime.utcnow().replace(day=1)
    ).all()

    # Create HTML report using Jinja2 template
    template = Template(open('templates/monthly_report.html').read())
    report_html = template.render(
        sections=sections,
        issued_ebooks=issued_ebooks,
        feedbacks=feedbacks
    )

    # Send the report via email
    send_message(librarian.email, "Monthly Activity Report", report_html)

    return "Monthly report sent successfully"

@shared_task
def export_ebook_csv():
    issued_ebooks = IssuedEbook.query.with_entities(
        IssuedEbook.user_id,
        IssuedEbook.ebook_id,
        IssuedEbook.issue_date,
        IssuedEbook.return_date,
        IssuedEbook.status
    ).all()

    csv_output = excel.make_response_from_query_sets(
        issued_ebooks, ["user_id", "ebook_id", "issue_date", "return_date", "status"], "csv"
    )

    filename = "issued_ebooks.csv"
    with open(filename, 'wb') as f:
        f.write(csv_output.data)

    return filename
