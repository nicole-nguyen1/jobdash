from flask_login import UserMixin
from sqlalchemy.orm import Mapped, mapped_column
from dbconnection import db

class User(db.Model, UserMixin):
        __tablename__ = "users"
        id: Mapped[int]= mapped_column(primary_key=True)
        email = db.Column(db.String(200), unique=True, nullable=False)
        password = db.Column(db.String(200), nullable=False)
        first_name = db.Column(db.String(200), nullable=False)
        last_name = db.Column(db.String(200), nullable=False)
        timestamp = db.Column(db.Integer)

        def __repr__(self):
                return '<email %r>' % (self.email, self.email)