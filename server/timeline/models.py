from __future__ import annotations
from dbconnection import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from auth.models import User

class Timeline(db.Model):
        __tablename__ = "timelines"
        id: Mapped[int] = mapped_column(primary_key=True)
        user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
        user: Mapped["User"] = relationship(backref="User")
        events: Mapped["TimelineEvent"] = relationship(backref="TimelineEvent")

        def __repr__(self):
                return '<id %r, user_id %r>' % (self.id, self.user_id)
        
class TimelineEvent(db.Model):
        __tablename__ = "timeline_events"
        id: Mapped[int] = mapped_column(primary_key=True)
        timeline_id: Mapped[int] = mapped_column(ForeignKey("timelines.id", ondelete="CASCADE"))
        date = db.Column(db.Date, nullable = False)
        status = db.Column(db.String(200), nullable=False)
        substatus = db.Column(db.String(200))

        def __repr__(self):
                return '<id %r, timeline_id %r, date %r, status %r, substatus %r>' % (
                        self.id, self.timeline_id, self.date, self.status, self.substatus
                        )