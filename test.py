from application.tasks import send_daily_reminders, send_monthly_report, export_csv_report

# Trigger the tasks
send_daily_reminders.delay()
send_monthly_report.delay()
export_csv_report.delay()
