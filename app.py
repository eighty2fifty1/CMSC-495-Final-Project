from flask import Flask, render_template
from flask_socketio import SocketIO, send
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

db = pymysql.connect(
    host='localhost',
    user='root',
    password='password',
    database='chat_db',
    cursorclass=pymysql.cursors.DictCursor
)

@socketio.on('message')
def handle_message(message):
    print(message)
    cursor = db.cursor()
    cursor.execute("INSERT INTO messages (message) VALUES (%s)", (message,))
    db.commit()
    cursor.close()
    send(message, broadcast=True)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
