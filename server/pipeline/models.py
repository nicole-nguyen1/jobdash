from __future__ import annotations
from dbconnection import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from timeline.models import Timeline
from auth.models import User

class Job(db.Model):
        __tablename__ = "jobs"
        id: Mapped[int] = mapped_column(primary_key=True)
        user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
        timeline_id: Mapped[int] = mapped_column(ForeignKey("timelines.id", ondelete="CASCADE"))
        company_name = db.Column(db.String(200), nullable=False)
        company_color = db.Column(db.String(200), nullable=False)
        company_url = db.Column(db.String(200))
        curr_status = db.Column(db.String(30), nullable=False)
        url = db.Column(db.String(200), default='')
        location = db.Column(db.String(200), default='')
        description = db.Column(db.Text, default='')
        card_color = db.Column(db.String(30), default='')
        is_archived = db.Column(db.Boolean, default = False)
        min_salary = db.Column(db.Integer, default = 0)
        max_salary = db.Column(db.Integer, default = 0)
        working_model = db.Column(db.String(30), default = '')
        user: Mapped["User"] = relationship(backref="User")
        timeline: Mapped["Timeline"] = relationship(backref="Timeline")

        def __repr__(self):
                return '<id %r, user_id %r, timeline_id %r, curr_status %r, url %r, location %r, description %r, company_name %r, company_color %r, card_color %r, is_archived %r, min_salary %r, max_salary %r, working_model %r>' % (
                    self.id, self.user_id, self.timeline_id, self.curr_status, 
                    self.url, self.location, self.description,
                    self.company_name, self.company_color, self.company_url,
                    self.card_color, self.is_archived, self.min_salary, self.max_salary, self.working_model
                    )