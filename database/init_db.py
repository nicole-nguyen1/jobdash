import os
from sqlite3 import OperationalError

import psycopg2
from dotenv import load_dotenv

load_dotenv('./.env')

conn = psycopg2.connect(
  host="localhost",
  database=os.environ.get('DB_NAME'),
  user=os.environ.get('DB_USERNAME'),
  password=os.environ.get('DB_PASSWORD'))

# Open a cursor to perform database operations
cur = conn.cursor()

# Open SQL file
fd = open('./create_db.sql', 'r')
sqlFile = fd.read()
fd.close()


sqlCommands = sqlFile.split('\n\n')
print(sqlCommands)

for command in sqlCommands:
  try:
      cur.execute(command)
      print(command)
  except OperationalError as msg:
      print("Command skipped: ", msg)

conn.commit()

cur.close()
conn.close()