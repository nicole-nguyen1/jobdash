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

# Execute a command: this creates a new table
cur.execute('DROP TABLE IF EXISTS books;')
# cur.execute('CREATE TABLE books (id serial PRIMARY KEY,'
#               'title varchar (150) NOT NULL,'
#               'author varchar (50) NOT NULL,'
#               'pages_num integer NOT NULL,'
#               'review text,'
#               'date_added date DEFAULT CURRENT_TIMESTAMP);'
#               )

# # Insert data into the table

# cur.execute('INSERT INTO books (title, author, pages_num, review)'
#             'VALUES (%s, %s, %s, %s)',
#             ('A Tale of Two Cities',
#              'Charles Dickens',
#              489,
#              'A great classic!')
#             )


# cur.execute('INSERT INTO books (title, author, pages_num, review)'
#             'VALUES (%s, %s, %s, %s)',
#             ('Anna Karenina',
#              'Leo Tolstoy',
#              864,
#              'Another great classic!')
#             )

conn.commit()

cur.close()
conn.close()