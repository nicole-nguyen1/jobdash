from auth.utils import find_user
from flask import Blueprint, jsonify

bp = Blueprint('pipeline', __name__, url_prefix='/pipeline')

from pipeline import routes


@bp.route('/', methods=["GET"])
def get_jobs():
  (user, cursor, conn) = find_user(['id'],False)

  query = """
    SELECT jobs.id,
      jobs.title,
      jobs.company_name,
      jobs.company_url,
      jobs.curr_status,
      jobs.company_color,
      jobs.card_color,
      jobs.url,
      jobs.min_salary,
      jobs.max_salary,
      jobs.location,
      jobs.working_model,
      jobs.description,
      jobs.timeline_id,
      timeline_events.substatus,
      timeline_events.date AS latest_update
    FROM jobs
    JOIN (
        SELECT timeline_id, MAX(date) AS max_date
        FROM timeline_events
        GROUP BY timeline_id
    ) AS latest_events
    ON jobs.timeline_id = latest_events.timeline_id
    JOIN timeline_events
    ON timeline_events.timeline_id = latest_events.timeline_id AND timeline_events.date = latest_events.max_date
    WHERE user_id = \'{0}\' AND is_archived = FALSE;
  """
  cursor.execute(query.format(user['id']))
  jobs = cursor.fetchall()

  cursor.close()
  conn.close()

  return jsonify(jobs)
