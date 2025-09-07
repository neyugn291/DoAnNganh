import os
import pymysql

HOST = os.environ.get('MYSQL_HOST')
USER = os.environ.get('MYSQL_USER')
PASSWORD = os.environ.get('MYSQL_PASSWORD')
DB = os.environ.get('MYSQL_DATABASE')
PORT = int(os.environ.get('MYSQL_PORT', 3306))

try:
    conn = pymysql.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database=DB,
        port=PORT
    )
    print("✅ Kết nối MySQL thành công")
except Exception as e:
    print("❌ Kết nối MySQL thất bại:", e)
