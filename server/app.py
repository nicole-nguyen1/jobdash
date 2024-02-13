import os

import redis
from auth import bp as auth_bp
from dotenv import load_dotenv
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from pipeline import bp as pipeline_bp
from timeline import bp as timeline_bp

load_dotenv('../database/.env')

# app instance
app = Flask(__name__)
CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

# Details on the Secret Key: https://flask.palletsprojects.com/en/3.0.x/config/#SECRET_KEY
app.secret_key = os.getenv('SECRET_KEY')

# Configure Redis for storing the session data on the server-side
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = redis.from_url(os.getenv('REDIS_URL'))

# Create and initialize the Flask-Session object AFTER `app` has been configured
server_session = Session(app)

# blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(pipeline_bp)
app.register_blueprint(timeline_bp)

# run app in dev
if __name__ == "__main__":
  app.run(debug=True, port=8080)