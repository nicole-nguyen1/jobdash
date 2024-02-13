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
      jobs.id,
      jobs.title,
      jobs.company_name,
      jobs.company_url,
      jobs.curr_status,
      jobs.company_color,
      jobs.card_color,
      jobs.url,
      jobs.salary,
      jobs.location,
      jobs.working_model,
      jobs.description,
      jobs.timeline_id,
      timeline_events.substatus,
      MAX(timeline_events.date) AS "latest_update" from jobs
    INNER JOIN timeline_events ON timeline_events.timeline_id=jobs.timeline_id
    WHERE user_id = \'{0}\' AND is_archived = FALSE
    GROUP BY jobs.id, timeline_events.timeline_id, timeline_events.substatus
  """
  cursor.execute(query.format(user['id']))
  jobs = cursor.fetchall()

  cursor.close()
  conn.close()

  return jsonify(jobs)
