
from flask import Flask, render_template, redirect, url_for, flash, session, \
    make_response, jsonify
from extensions import db, bcrypt, socketio,send
from forms import RegistrationForm, LoginForm
from models import User, Message
from sqlalchemy.exc import IntegrityError  # Import IntegrityError for database errors


app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_very_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy, Bcrypt, and SocketIO extensions
db.init_app(app)
bcrypt.init_app(app)
socketio.init_app(app, cors_allowed_origins="*")

@app.route('/', methods=['GET'])
def index():
    if 'user_id' in session:
        return redirect(url_for('chat'))
    return redirect(url_for('login'))


"""

@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        return redirect(url_for('chat'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to log in', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

    """


@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        return redirect(url_for('chat'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        try:
            db.session.add(user)
            db.session.commit()
            flash('Your account has been created! You are now able to log in', 'success')
            return redirect(url_for('login'))
        except IntegrityError:  # Handle database integrity error (e.g., duplicate email)
            db.session.rollback()  # Rollback transaction
            flash('Email already exists. Please use a different email.', 'danger')
    return render_template('register.html', form=form)





@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('chat'))  # If user is already logged in, redirect to chat page

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            session['user_id'] = user.id
            flash('Login successful!', 'success')
            return redirect(url_for('chat'))  # Redirect to chat page after successful login
        else:
            flash('Login unsuccessful. Please check email and password.', 'danger')

    return render_template('login.html', form=form)

@app.route('/chat')
def chat():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('chat.html')



@app.route('/json')
def get_data():
    with open('C:/Users/wrest/PycharmProjects/CMSC-495-Final-Project/static/json/dummyChat.json', 'r') as file:
        json_data = file.read()
        response = make_response(jsonify(json_data))
        response.headers['Access-Control-Allow-Origin'] = '*'  # Allow all origins
    return response

@socketio.on('message')
def handle_message(message):
    print("Received message: ", message)
    # Save message using SQLAlchemy ORM
    new_message = Message(message=message)
    db.session.add(new_message)
    db.session.commit()
    send(message, broadcast=True)


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True)
