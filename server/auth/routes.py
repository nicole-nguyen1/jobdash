from flask import jsonify, request
from auth import bp
from dbconnection import get_db_connection
import bcrypt

@bp.route('/signup', methods=['POST'])
def signup():
  data = request.get_json()
  first_name = data['firstName']
  last_name = data['lastName']
  email = data['email']

  # check if user currently exists
  conn = get_db_connection()
  cursor = conn.cursor()
  cursor.execute('SELECT id from users WHERE email = (%s)', (email,))
  found_user_id = cursor.fetchone()

  # if user does not exist, add to db
  if (found_user_id is None):
    password = data['password']
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(bytes, salt)

    cursor.execute('INSERT INTO users (firstname, lastname, email, password) '
                  'VALUES (%s, %s, %s, %s) RETURNING id',
                  (first_name, last_name, email, hashed_password,))
    found_user_id = cursor.fetchone()
    event = 'USER_CREATED_SUCCESS'
  else:
    event = 'USER_ALREADY_EXISTS'

  conn.commit()

  cursor.close()
  conn.close()
  return jsonify({'userID': found_user_id[0], 'event': event})