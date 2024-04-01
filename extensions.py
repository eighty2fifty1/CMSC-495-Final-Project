from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO,send

db = SQLAlchemy()
bcrypt = Bcrypt()
socketio = SocketIO()


