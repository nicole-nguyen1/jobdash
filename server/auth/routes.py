import bcrypt
from auth import bp
from auth.utils import find_user
from flask import jsonify, request, session


# home route
@bp.route("/session", methods=['GET'])
def home():
  email = session.get('username')
  user = find_user(['id'], email, True)
  print(session.items())
  print(email)
  print(user)
  if (user is None):
    return jsonify({}), 401
  else:
    return jsonify({}), 200

@bp.route('/signup', methods=['POST'])
def signup():
  data = request.get_json()
  first_name = data['firstName']
  last_name = data['lastName']
  email = data['email']

  # check if user currently exists
  (user, cursor, conn) = find_user(['id'], email, False)

  # if user does not exist, add to db
  if (user is None):
    password = data['password']
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(bytes, salt)

    cursor.execute('INSERT INTO users (firstname, lastname, email, password) '
                  'VALUES (%s, %s, %s, %s) RETURNING id',
                  (first_name, last_name, email, hashed_password,))
    user = cursor.fetchone()
    event = 'USER_CREATED_SUCCESS'
    session['username'] = email
  else:
    event = 'USER_ALREADY_EXISTS'

  conn.commit()

  cursor.close()
  conn.close()
  return jsonify({'event': event})

@bp.route('/login', methods=['POST'])
def login():
  data = request.get_json()
  email = data['email']
  password = data['password']

  # find user
  user = find_user(['id', 'password'], email, True)

  event = 'USER_LOGIN_FAILED'
  if (user is not None):
    # check password
    check_pw = bcrypt.checkpw(password.encode('utf-8'), bytes(user[1]))
    if (check_pw is True):
      session["username"] = email
      event = 'USER_LOGIN_SUCCESS'

  print(session.items())
  return jsonify({'event': event})

@bp.route('/logout', methods=['POST'])
def logout():
  session.pop('username')
  return jsonify({'event': 'USER_LOGOUT_SUCCESS'})