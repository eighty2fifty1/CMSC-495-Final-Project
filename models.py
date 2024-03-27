from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy with no settings
db = SQLAlchemy()

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