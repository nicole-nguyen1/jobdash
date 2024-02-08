from dbconnection import get_db_connection


def find_user(sql_columns: list, email: str, shouldCloseConnection: bool):
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
