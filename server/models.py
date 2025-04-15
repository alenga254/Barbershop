from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from config import db
from flask_login import UserMixin

class Client(db.Model, UserMixin):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    appointments = db.relationship('Appointment', backref='client', lazy=True)
    reviews = db.relationship('Review', back_populates='client', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Barber(db.Model):
    __tablename__ = 'barbers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    specialization = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    image_url = db.Column(db.String(255))  

    appointments = db.relationship('Appointment', backref='barber', lazy=True)
    reviews = db.relationship('Review', back_populates='barber', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'specialization': self.specialization,
            'email': self.email,
            'image_url': self.image_url  # Include the image_url in the dictionary
        }


class Service(db.Model, SerializerMixin):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)

    appointments = db.relationship('Appointment', backref='service', lazy=True)

    serialize_rules = ('-appointments.service',)


class Appointment(db.Model, SerializerMixin):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    barber_id = db.Column(db.Integer, db.ForeignKey('barbers.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default="Scheduled")

    serialize_rules = (
        '-client.appointments',
        '-barber.appointments',
        '-service.appointments',
        '-client.reviews', 
        '-barber.reviews',  
    )

    def to_dict(self):
        return {
            'id': self.id,
            'client_id': self.client_id,
            'barber_id': self.barber_id,
            'service_id': self.service_id,
            'date_time': self.date_time.isoformat() if self.date_time else None,
            'status': self.status
        }


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    barber_id = db.Column(db.Integer, db.ForeignKey('barbers.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)

    client = db.relationship('Client', back_populates='reviews', lazy=True)
    barber = db.relationship('Barber', back_populates='reviews', lazy=True)

    serialize_rules = ('-client.reviews', '-barber.reviews', '-appointment.reviews')
