from application.tasks import send_email, send_monthly_report, export_csv_report


send_email("example.com", "Test message","Hi user here is a reminder for you to return the book")
send_monthly_report()
export_csv_report()
