from application.tasks import send_daily_reminders

# Trigger the task
send_daily_reminders.delay()
