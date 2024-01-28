from flask import Flask, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt

from auth import bp as auth_bp

# app instance
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# blueprints
app.register_blueprint(auth_bp)

# home route
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