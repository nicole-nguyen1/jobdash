import bcrypt
from auth import bp
from auth.models import User
from auth.utils import find_user
from flask import jsonify, request, session
from ..extensions import db

# home route
@bp.route("/session", methods=['GET'])
def home():
  if (session['username'] is None):
    return jsonify({}), 401
  else:
    return jsonify({}), 200

@bp.route('/signup', methods=['POST'])
def signup():
  data = request.get_json()
  f_name = data['firstName']
  l_name = data['lastName']
  email = data['email']

  # check if user currently exists
  user = find_user(email)
  # if user does not exist, add to db
  if (user is None):
    password = data['password']
    bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(bytes, salt)
    
    user = User(
        email = email,
        first_name = f_name,
        last_name = l_name,
        password = hashed_password
    )
    db.session.add(user)
    db.session.commit()
    event = 'USER_CREATED_SUCCESS'
  else:
    event = 'USER_ALREADY_EXISTS'

  return jsonify({'event': event})

@bp.route('/login', methods=['POST'])
def login():
  data = request.get_json()
  email = data['email']
  password = data['password']

  # find user
  user = find_user(email)

  event = 'USER_LOGIN_FAILED'
  if (user is not None):
    # check password
    check_pw = bcrypt.checkpw(password.encode('utf-8'), bytes(user['password']))
    if (check_pw is True):
      session["username"] = email
      event = 'USER_LOGIN_SUCCESS'

  print(session.items())
  return jsonify({'event': event})

@bp.route('/logout', methods=['POST'])
def logout():
  session.pop('username')
  return jsonify({'event': 'USER_LOGOUT_SUCCESS'})