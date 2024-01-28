import os
import psycopg2
from dotenv import load_dotenv
load_dotenv('../database/.env')

def get_db_connection():
  conn = psycopg2.connect(host='localhost',
    database=os.environ.get('DB_NAME'),
    user=os.environ.get('DB_USERNAME'),
    password=os.environ.get('DB_PASSWORD'))
  return conn