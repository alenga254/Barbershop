# config.py
from datetime import timedelta
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_login import LoginManager

# Instantiate app
app = Flask(__name__)

# Setup login manager (but don't call user_loader here!)
login_manager = LoginManager()
login_manager.init_app(app)
# Optional: login_manager.login_view = "login"

# App config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///barbershop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "supersecretkey"
app.config["SESSION_TYPE"] = "filesystem"
app.json.compact = False
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=7)

# DB setup
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# API & CORS
api = Api(app)
CORS(app, supports_credentials=True)
