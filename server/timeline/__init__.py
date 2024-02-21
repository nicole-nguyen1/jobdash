from flask import Blueprint

bp = Blueprint('timeline', __name__, url_prefix='/timeline')

from timeline import routes
