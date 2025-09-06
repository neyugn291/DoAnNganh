import os
import json
import firebase_admin
from firebase_admin import credentials, messaging

# Lấy JSON từ biến môi trường
service_account_info = os.environ["FIREBASE_ADMIN_JSON"]

# Chuyển chuỗi JSON thành dict
service_account_info = json.loads(service_account_info)

# Fix private_key: thay "\\n" thành "\n"
service_account_info["private_key"] = service_account_info["private_key"].replace("\\n", "\n")

# Initialize Firebase Admin
cred = credentials.Certificate(service_account_info)
firebase_admin.initialize_app(cred)

def send_push_notification(token, title, body):
    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body),
        token=token,
    )
    response = messaging.send(message)
    return response
