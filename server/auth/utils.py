from dbconnection import get_db_connection, db
from flask import session
from auth.models import User
from sqlalchemy import Select, exc


## deprecated
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

def find_user():
  try:
    session_email = session.get('email')
    user = User.query.filter_by(email=session_email).first()
    print(user)
    return user
  except exc.SQLAlchemyError:
    raise Exception("Encounted SQL Error by finding User!")
  
def find_user(email: str):
  try:
    user = User.query.filter_by(email=email).first()
    print(user)
    return user
  except exc.SQLAlchemyError:
    raise Exception("Encounted SQL Error by finding User!")