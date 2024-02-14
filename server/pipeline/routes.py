from auth.utils import find_user
from flask import jsonify, request, session
from markupsafe import escape
from pipeline import bp
from pipeline.api.ats_factory import ATSFactory
from pipeline.utils import convertToIntOrNull, convertToStringOrNull


@bp.route("/add", methods=['POST'])
def add_job():
  data = request.get_json()
  (user, cursor, conn) = find_user(['id'], False)

  if (user is None):
    return jsonify({}), 401

  user_id = user['id']
  status = data['status']
  substatus = data['substatus']
  date = data['date']
  url = data.get('url')
  title = data.get('jobTitle')
  company_name = data.get('company')
  company_color = data.get('companyColor')
  company_url = data.get('companyURL')
  location = None
  working_model = None
  description = None
  min_salary = None
  max_salary = None

  if (url is not None):
    ImporterType = ATSFactory('GREENHOUSE')
    Importer = ImporterType(url)
    fields = Importer.import_from_url()
    company_name = fields.company_name
    title = fields.title
    location = fields.location
    description = fields.description
    min_salary = fields.min_salary
    max_salary = fields.max_salary

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
                 (timeline_id['id'], date, status, substatus))
  event = cursor.fetchone()
  if (event is None):
    return jsonify({'event': 'TIMELINE_EVENT_CREATION_FAILED'})

  jobs_query = """
    INSERT INTO jobs
      (user_id,
      timeline_id,
      curr_status,
      url,
      title,
      company_name,
      company_color,
      company_url,
      location,
      working_model,
      description,
      min_salary,
      max_salary)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING *
  """

  print(user_id,
        timeline_id['id'],
        status,
        url,
        title,
        company_name,
        company_color,
        company_url,
        location,
        working_model,
        description,
        min_salary,
        max_salary)
  cursor.execute(jobs_query, (user_id,
                              timeline_id['id'],
                              status,
                              url,
                              title,
                              company_name,
                              company_color,
                              company_url,
                              location,
                              working_model,
                              description,
                              min_salary,
                              max_salary))
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

    if (job['id'] is None or job['is_archived'] is False):
      event = 'JOB_NOT_ARCHIVED'
      event_code = 500
    elif (job['id'] is not None and job['is_archived'] is True):
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


@bp.route('/update', methods=['POST'])
def update_job():
  data = request.get_json()
  job_id = request.args.get('job_id')
  (user, cursor, conn) = find_user(['id'], False)

  if (user is not None):
    safe_job_id = escape(job_id)

    company_name = data['company']
    company_url = data['companyURL']
    title = data['jobTitle']
    url = data['url']
    card_color = data['cardColor']
    min_salary = data['minSalary']
    max_salary = data['maxSalary']
    location = data['location']
    working_model = data['workingModel']
    description = data['description']

    update_query = """
      UPDATE jobs
      SET company_name = \'{0}\',
          company_url = \'{1}\',
          title = \'{2}\',
          url = {3},
          card_color = {4},
          min_salary = {5},
          max_salary = {6},
          location = {7},
          working_model = {8},
          description = {9}
      WHERE id = \'{10}\'
      RETURNING *
    """

    cursor.execute(update_query.format(
        company_name,
        company_url,
        title,
        convertToStringOrNull(url),
        convertToStringOrNull(card_color),
        convertToIntOrNull(min_salary),
        convertToIntOrNull(max_salary),
        convertToStringOrNull(location),
        convertToStringOrNull(working_model),
        convertToStringOrNull(description),
        safe_job_id
    ))
    job = cursor.fetchone()

    if (job is None):
      event = 'JOB_NOT_UPDATED'
      event_code = 500
    elif (job is not None):
      conn.commit()
      event = 'JOB_UPDATED'
      event_code = 200
  else:
    event = 'UNAUTHORIZED_TO_UPDATE'
    event_code = 401

  cursor.close()
  conn.close()

  return jsonify({'event': event}, event_code)
