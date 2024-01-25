import os
import psycopg2
from flask import Flask, jsonify
from flask_cors import CORS

# app instance
app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = psycopg2.connect(host='localhost',
      database=os.environ.get('DB_NAME'),
      user=os.environ.get('DB_USERNAME'),
      password=os.environ.get('DB_PASSWORD'))
    return conn

@app.route("/api/home", methods=['GET'])
def home():
  # conn = get_db_connection()
  # cur = conn.cursor()
  # cur.execute('SELECT * FROM books;')
  # books = cur.fetchall()
  # cur.close()
  # conn.close()
  return jsonify({
    'message': 'Hello world!',
    # 'books': books
  })

# run app in dev
if __name__ == "__main__":
  app.run(debug=True, port=8080)