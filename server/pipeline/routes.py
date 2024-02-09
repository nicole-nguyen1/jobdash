from auth.utils import find_user
from flask import jsonify, request, session
from pipeline import bp


# TODO when clicking save job, disable buttons in loading state, close modal, update pipeline view
@bp.route("/add", methods=['POST'])
def add_job():
  data = request.get_json()
  email = session.get('username')
  (user, cursor, conn) = find_user(['id'], email, False)

  if (user is None):
    return jsonify({}), 401

  user_id = user[0]
  status = data['status']
  substatus = data['substatus']
  date = data['date']
  title = data['jobTitle']
  company_name = data['company']
  url = data['url']
  company_color = data['companyColor']
  date = data['date']
  company_url = data['companyURL']

  # create new timeline first
  insert_query = """
    WITH query as (
        SELECT id as userid from users
        WHERE id = \'{0}\'
    )
    INSERT into timelines (
        user_id
    ) SELECT userid from query
    RETURNING id
  """
  cursor.execute(insert_query.format(user_id))
  timeline_id = cursor.fetchone()
  if (timeline_id is None):
    return jsonify({'event': 'TIMELINE_CREATION_FAILED'})

  # create timeline event for job
  cursor.execute('INSERT INTO timeline_events (timeline_id, date, status, substatus) '
                 'VALUES (%s, %s, %s, %s) RETURNING id',
                 (timeline_id[0], date, status, substatus))
  event = cursor.fetchone()
  if (event is None):
    return jsonify({'event': 'TIMELINE_EVENT_CREATION_FAILED'})

  cursor.execute('INSERT INTO jobs (user_id, timeline_id, curr_status, title, company_name, url, company_color, company_url) '
                 'VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id',
                 (user_id, timeline_id[0], status, title, company_name, url, company_color, company_url))
  job_id = cursor.fetchone()

  conn.commit()

  cursor.close()
  conn.close()

  if (job_id is None):
    return jsonify({'event': 'JOB_CREATION_FAILED'})
  else:
    return jsonify({'event': 'JOB_CREATION_SUCCESS'})
