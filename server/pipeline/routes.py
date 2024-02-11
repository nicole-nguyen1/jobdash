from auth.utils import find_user
from flask import jsonify, request, session
from markupsafe import escape
from pipeline import bp


@bp.route("/add", methods=['POST'])
def add_job():
  data = request.get_json()
  (user, cursor, conn) = find_user(['id'], False)

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

@bp.route('/archive', methods=['POST'])
def archive_job():
  job_id = request.args.get('job_id')
  (user, cursor, conn) = find_user(['id'], False)

  if (user is not None):
    safe_job_id = escape(job_id)

    update_query = """
      UPDATE jobs
      SET is_archived = true
      WHERE id = \'{0}\'
      RETURNING id, is_archived
    """

    cursor.execute(update_query.format(safe_job_id))
    job = cursor.fetchone()

    if (job[0] is None or job[1] is False):
      event = 'JOB_NOT_ARCHIVED'
      event_code = 500
    elif (job[0] is not None and job[1] is True):
      conn.commit()
      event = 'JOB_ARCHIVED'
      event_code = 200
  else:
    event = 'UNAUTHORIZED_TO_ARCHIVE'
    event_code = 401

  cursor.close()
  conn.close()

  return jsonify({'event': event}, event_code)


@bp.route('/delete', methods=['POST'])
def delete_job():
  job_id = request.args.get('job_id')
  (user, cursor, conn) = find_user(['id'], False)

  if (user is not None):
    safe_job_id = escape(job_id)

    delete_query = """
      DELETE FROM jobs
      WHERE id = \'{0}\'
      RETURNING id
    """
    cursor.execute(delete_query.format(safe_job_id))
    count = cursor.rowcount
    if (count == 0):
      event = 'JOB_NOT_DELETED'
      event_code = 500
    elif (count == 1):
      conn.commit()
      event = 'JOB_DELETED'
      event_code = 200
  else:
    event = 'UNAUTHORIZED_TO_DELETE'
    event_code = 401

  cursor.close()
  conn.close()

  return jsonify({'event': event}, event_code)







