from auth.utils import find_user
from dbconnection import get_db_connection
from flask import Blueprint, jsonify, session

bp = Blueprint('pipeline', __name__, url_prefix='/pipeline')

from pipeline import routes


@bp.route('/', methods=["GET"])
def get_jobs():
  (user, cursor, conn) = find_user(['id'],False)

  query = """
    SELECT
      jobs.*,
      timeline_events.substatus,
      MAX(timeline_events.date) AS "latest_update" from jobs
    INNER JOIN timeline_events ON timeline_events.timeline_id=jobs.timeline_id
    WHERE user_id = \'{0}\' AND is_archived = FALSE
    GROUP BY jobs.id, timeline_events.timeline_id, timeline_events.substatus
  """
  cursor.execute(query.format(user[0]))
  jobs = cursor.fetchall()
  payload = []

  for job in jobs:
    payload.append({
      'id': job[0],
      'title': job[2],
      'companyName': job[3],
      'currStatus': job[4],
      'url': job[5],
      'salary': job[6],
      'location': job[7],
      'workingModel': job[8],
      'description': job[9],
      'companyColor': job[10],
      'cardColor': job[11],
      'timelineID': job[12],
      'companyURL': job[13],
      'substatus': job[15],
      'lastUpdated': job[16]
    })

  cursor.close()
  conn.close()

  return jsonify(payload)
