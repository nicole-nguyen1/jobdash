from auth.utils import find_user
from auth.models import User
from pipeline.models import Job
from timeline.models import TimelineEvent
from dbconnection import db
from flask import Blueprint, jsonify
from sqlalchemy import func, select


bp = Blueprint('pipeline', __name__, url_prefix='/pipeline')

@bp.route('/', methods=["GET"])
def get_jobs():
  user: User = find_user()
  #TODO: Fix the query and execution
  latest_events_query = select(TimelineEvent.id, func.max(TimelineEvent.date)).group_by(TimelineEvent.id).subquery()
  job_query = db.select(Job, TimelineEvent.substatus, TimelineEvent.date).join(latest_events_query).join(TimelineEvent.id==latest_events_query.c.id).where(Job.user_id == user.id, Job.is_archived == False)
  jobs = db.session.execute(job_query).scalar()

    # JOIN timeline_events
    # ON timeline_events.timeline_id = latest_events.timeline_id 
    # AND timeline_events.date = latest_events.max_date


  return jsonify(jobs)
