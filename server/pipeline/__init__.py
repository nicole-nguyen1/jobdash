from auth.utils import find_user
from dbconnection import get_db_connection
from flask import Blueprint, jsonify, session

bp = Blueprint('pipeline', __name__, url_prefix='/pipeline')

from pipeline import routes


@bp.route('/', methods=["GET"])
def get_jobs():
  (user, cursor, conn) = find_user(['id'],False)

  query = """
    SELECT jobs.id, jobs.title, jobs.company_name, jobs.curr_status, jobs.company_color, jobs.card_color, jobs.company_url, timeline_events.timeline_id, MAX(timeline_events.date) AS "latest_update" from jobs
    INNER JOIN timeline_events ON timeline_events.timeline_id=jobs.timeline_id
    WHERE user_id = \'{0}\' AND is_archived = FALSE
    GROUP BY jobs.id, timeline_events.timeline_id
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
      'companyURL': job[6],
      'timelineID': job[7],
      'lastUpdated': job[8]
    })

  cursor.close()
  conn.close()

  return jsonify(payload)
