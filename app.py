from flask import Flask, render_template
from flask_socketio import SocketIO, send
from models import db, Message, User  # Import db and Message from models.py

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key?'

# SQLite configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Bind the instance of SQLAlchemy to your Flask app
db.init_app(app)

# Initialize SocketIO with CORS allowed
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(message):
    print("Received message: ", message)
    # Save message using SQLAlchemy ORM
    new_message = Message(message=message)
    db.session.add(new_message)
    db.session.commit()
    send(message, broadcast=True)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create SQLite database and tables before running the app
    socketio.run(app, debug=True, port=5000)
