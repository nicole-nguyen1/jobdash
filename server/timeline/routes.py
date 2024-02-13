from auth.utils import find_user
from flask import jsonify, request
from markupsafe import escape
from timeline import bp


@bp.route('/<timeline_id>', methods=["GET"])
def get_timeline(timeline_id):
  (user, cursor, conn) = find_user(['id'],False)

  if (user is None):
    return jsonify({}, 401)

  safe_timeline_id = escape(timeline_id)

  query = """
    SELECT
      id,
      date,
      status,
      substatus from timeline_events
    WHERE timeline_id = \'{0}\'
    ORDER BY date DESC
  """
  cursor.execute(query.format(safe_timeline_id))
  events = cursor.fetchall()

  cursor.close()
  conn.close()

  return jsonify(events)

@bp.route("/add", methods=['POST'])
def add_timeline_event():
  data = request.get_json()
  timeline_id = request.args.get('timeline_id')
  (user, cursor, conn) = find_user(['id'], False)

  if (user is None):
    return jsonify({}), 401

  safe_timeline_id = escape(timeline_id)
  status = data['status']
  substatus = data['substatus']
  date = data['date']

  # create timeline event for job
  cursor.execute('INSERT INTO timeline_events (timeline_id, date, status, substatus) '
                 'VALUES (%s, %s, %s, %s) RETURNING id',
                 (safe_timeline_id, date, status, substatus))
  event = cursor.fetchone()

  if (event is None):
    return jsonify({'event': 'TIMELINE_EVENT_CREATION_FAILED'})

  conn.commit()

  cursor.close()
  conn.close()

  return jsonify({'event': 'TIMELINE_EVENT_CREATION_SUCCESS'})

@bp.route('/update', methods=['POST'])
def update_job():
  data = request.get_json()
  event_id = request.args.get('event_id')
  (user, cursor, conn) = find_user(['id'], False)

  if (user is not None):
    safe_event_id = escape(event_id)
    status = data['status']
    substatus = data['substatus']
    date = data['date']

    update_query = """
      UPDATE timeline_events
      SET status = \'{0}\',
          substatus = \'{1}\',
          date = \'{2}\'
      WHERE id = \'{3}\'
      RETURNING *
    """

    cursor.execute(update_query.format(
      status,
      substatus,
      date,
      safe_event_id,
    ))
    event = cursor.fetchone()

    if (event is None):
      event = 'TIMELINE_EVENT_NOT_UPDATED'
      event_code = 500
    elif (event is not None):
      conn.commit()
      event = 'TIMELINE_EVENT_UPDATED'
      event_code = 200
  else:
    event = 'UNAUTHORIZED_TO_UPDATE_TIMELINE_EVENT'
    event_code = 401

  cursor.close()
  conn.close()

  return jsonify({'event': event}, event_code)

@bp.route('/delete', methods=['POST'])
def delete_job():
  event_id = request.args.get('event_id')
  (user, cursor, conn) = find_user(['id'], False)

  if (user is not None):
    safe_event_id = escape(event_id)

    delete_query = """
      DELETE FROM timeline_events
      WHERE id = \'{0}\'
      RETURNING id
    """
    cursor.execute(delete_query.format(safe_event_id))
    count = cursor.rowcount
    if (count == 0):
      event = 'TIMELINE_EVENT_NOT_DELETED'
      event_code = 500
    elif (count == 1):
      conn.commit()
      event = 'TIMELINE_EVENT_DELETED'
      event_code = 200
  else:
    event = 'UNAUTHORIZED_TO_DELETE_TIMELINE_EVENT'
    event_code = 401

  cursor.close()
  conn.close()

  return jsonify({'event': event}, event_code)