import requests

def send_chat_message(webhook_url, message):
    headers = {'Content-Type': 'application/json'}
    data = {
        'text': message
    }
    response = requests.post(webhook_url, json=data, headers=headers)
    response.raise_for_status()
