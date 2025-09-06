import firebase_admin
from firebase_admin import credentials, messaging

cred = credentials.Certificate("StudyHub/studyhub-75cef-firebase-adminsdk-fbsvc-6b802fa5f5.json")
firebase_admin.initialize_app(cred)

def send_push_notification(token, title, body):
    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body),
        token=token,
    )
    response = messaging.send(message)
    return response

