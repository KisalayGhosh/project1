from twilio.rest import Client

TWILIO_ACCOUNT_SID = 'AC1eef1f2518d03d091711e550a2d8f9cd'
TWILIO_AUTH_TOKEN = 'f9d69f9d8dd14ea8fdb59f652ab5f8e0'
TWILIO_PHONE_NUMBER = '+19785068806'

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_sms(to, message):
    client.messages.create(
        to=to,
        from_=TWILIO_PHONE_NUMBER,
        body=message
    )
