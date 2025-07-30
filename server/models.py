from app import db
from sqlalchemy import event


class Log(db.Model):
    __tablename__ = "log"
    
    cookies = db.Column(db.Text, unique=False, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    host = db.Column(db.Text, unique=False, nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    keystrokes = db.Column(db.Text, unique=False, nullable=False)
    local_storage = db.Column(db.Text, unique=False, nullable=True)
    session_storage = db.Column(db.Text, unique=False, nullable=True)
    user_agent = db.Column(db.Text, unique=False, nullable=False)

    def __repr__(self):
        return '<Log %r>' % self.id

    @property
    def serialize(self):
        return {
            "cookies": self.cookies,
            "created_at": self.created_at,
            "host": self.host,
            "id": self.id,
            "keystrokes": self.keystrokes,
            "local_storage": self.local_storage,
            "session_storage": self.session_storage,
            "user_agent": self.user_agent
        }


class Payload(db.Model):
    __tablename__ = "payload"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True, nullable=False)
    payload = db.Column(db.Text, unique=False, nullable=False)
    transformed_payload = db.Column(db.Text, unique=False, nullable=True, default=True)

    def __repr__(self):
        return '<Payload %r>' % self.name

    @property
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "payload": self.payload
        }


class User(db.Model):
    __tablename__ = "user"
    
    dark_mode = db.Column(db.Boolean, default=True, nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    password = db.Column(db.String(200), unique=True, nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username


@event.listens_for(Payload.__table__, 'after_create')
def create_departments(*args, **kwargs):
    with open('./fixtures/default_payload.txt', 'r') as file:
        default_payload = file.read().rstrip()

    db.session.add(Payload(name='Default XSS Payload', payload=default_payload))
    db.session.commit()
