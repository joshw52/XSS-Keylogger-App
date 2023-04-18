import logging
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


bcrypt = Bcrypt()
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    logging.getLogger('flask_cors').level = logging.DEBUG

    app.config['JWT_ACCESS_COOKIE_PATH'] = '/api'
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['JWT_CSRF_IN_COOKIES'] = False
    app.config['JWT_SECRET_KEY'] = '_5#y2L"F4Q8z\n\xec]/'
    app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db.sqlite3"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

    bcrypt.init_app(app)
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    return app
