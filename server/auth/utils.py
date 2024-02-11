from dbconnection import get_db_connection
from flask import session


# nonSessionUserLookupEmail param is needed for sign up and sign in operations
# In general, this param is optional as most uses of find_user are for other operations
def find_user(sql_columns: list, shouldCloseConnection: bool, nonSessionUserLookupEmail: str = ''):
  email = session.get('username')

  if (email is None):
    email = nonSessionUserLookupEmail

  conn = get_db_connection()
  cursor = conn.cursor()
  query = 'SELECT %s from users' % ','.join(sql_columns) + ' WHERE email = \'%s\'' % email
  cursor.execute(query)
  user = cursor.fetchone()

  if (shouldCloseConnection):
    cursor.close()
    conn.close()
    return user
  else:
    return user, cursor, conn
