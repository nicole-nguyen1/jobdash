import os

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row
from sqlalchemy.orm import DeclarativeBase
from flask_sqlalchemy import SQLAlchemy
from flask import Flask

load_dotenv('../database/.env')

#deprecated
def get_db_connection():
  connection_string = """
    host=localhost port=5432 dbname={0} user={1} password={2}
  """
  conn = psycopg.connect(
    connection_string.format(
      os.environ.get('DB_NAME'),
      os.environ.get('DB_USERNAME'),
      os.environ.get('DB_PASSWORD')
    ),
    row_factory=dict_row
  )
  return conn

# Configure db connection with SQLAlchemy
class Base(DeclarativeBase):
  pass
db = SQLAlchemy(model_class=Base)

connection_string = """postgresql:///?User={0}&Password={1}&Database=postgres&Server={2}&Port=5432"""
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = connection_string.format(
  os.environ.get('DB_USERNAME'),
  os.environ.get('DB_PASSWORD'),
  os.environ.get('DB_IP')
)
app.config.update(
    SQLALCHEMY_DATABASE_URI=connection_string.format(
    os.environ.get('DB_USERNAME'),
    os.environ.get('DB_PASSWORD'),
    os.environ.get('DB_IP')
    ))
db.init_app(app)