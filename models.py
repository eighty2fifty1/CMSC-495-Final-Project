# models.py
from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    
    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"


class User(db.Model):
    id = db.Column(db.String, primary_key=True)
    password = db.Column(db.String)
    email_addr = db.Column(db.String)
    #contacts =

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=db.func.current_timestamp())

    def __repr__(self):
        return f'<Message {self.message}>'
