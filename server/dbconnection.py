import os

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row

load_dotenv('../database/.env')

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