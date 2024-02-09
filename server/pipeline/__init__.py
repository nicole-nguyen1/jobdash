from auth.utils import find_user
from dbconnection import get_db_connection
from flask import Blueprint, jsonify, session

bp = Blueprint('pipeline', __name__, url_prefix='/pipeline')

from pipeline import routes


@bp.route('/', methods=["GET"])
def get_jobs():
  email = session.get('username')
  (user, cursor, conn) = find_user(['id'], email, False)

  query = """
    SELECT id, title, company_name, curr_status, company_color, card_color, company_url from jobs
    WHERE user_id = \'{0}\'
    GROUP BY id, curr_status
  """
  cursor.execute(query.format(user[0]))
  jobs = cursor.fetchall()
  payload = []

  for job in jobs:
    payload.append({
      'id': job[0],
      'title': job[1],
      'companyName': job[2],
      'currStatus': job[3],
      'cardColor': job[5] if job[5] is not None else job[4],
      'companyURL': job[6]
    })

  cursor.close()
  conn.close()

  return jsonify(payload)
