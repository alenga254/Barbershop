from flask import request, session
from flask_restful import Resource
from datetime import datetime
from flask import jsonify
from flask_login import current_user, login_required, login_user, logout_user

from config import db
from models import Client, Barber, Service, Appointment, Review
from sqlalchemy.exc import IntegrityError

class SignupResource(Resource):
    def post(self):
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not all([name, email, password]):
            return {'error': 'All fields are required'}, 400

        try:
            user = Client(name=name, email=email)
            user.set_password(password)
            db.session.add(user)
            db.session.commit()

            session['user_id'] = user.id

            return {
                'message': 'Signup successful',
                'user_id': user.id,
                'name': user.name,
                'email': user.email
            }, 201

        except IntegrityError:
            db.session.rollback()
            return {'error': 'Email already exists'}, 400


class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = Client.query.filter_by(email=email).first()

        if user and user.check_password(password):
            login_user(user)  # Flask-Login manages the session here
            return {
                'message': 'Login successful',
                'user_id': user.id,
                'name': user.name,
                'email': user.email
            }, 200
        else:
            return {'error': 'Invalid credentials'}, 401

class LogoutResource(Resource):
    def delete(self):
        logout_user()
        return {'message': 'Logged out successfully'}, 204

class CheckSession(Resource):
    def get(self):
        if current_user.is_authenticated:
            return {
                'user_id': current_user.id,
                'name': current_user.name,
                'email': current_user.email
            }, 200
        else:
            return {'error': 'Unauthorized'}, 401


# -------- Clients --------
class ClientList(Resource):
    def get(self):
        return [client.to_dict() for client in Client.query.all()], 200

    def post(self):
        data = request.get_json()
        if not data:
            return {"error": "Invalid input"}, 400

        try:
            client = Client(
                name=data["name"],
                email=data["email"],
                phone=data["phone"]
            )
            db.session.add(client)
            db.session.commit()
            return client.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400

# -------- Barbers --------
class BarberList(Resource):
    def get(self):
        return [barber.to_dict() for barber in Barber.query.all()], 200

    def post(self):
        data = request.get_json()
        if not data:
            return {"error": "Invalid input"}, 400

        try:
            barber = Barber(
                name=data["name"],
                specialty=data.get("specialty", ""),
                phone=data["phone"]
            )
            db.session.add(barber)
            db.session.commit()
            return barber.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400

# -------- Services --------
class ServiceList(Resource):
    def get(self):
        return [service.to_dict() for service in Service.query.all()], 200

    def post(self):
        data = request.get_json()
        if not data:
            return {"error": "Invalid input"}, 400

        try:
            service = Service(
                name=data["name"],
                price=data["price"],
                description=data.get("description", "")
            )
            db.session.add(service)
            db.session.commit()
            return service.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400

# -------- Reviews --------
class ReviewList(Resource):
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        data = request.get_json()
        barber_id = data.get("barber_id")
        rating = data.get("rating")
        comment = data.get("comment")

        if not all([barber_id, rating]):
            return {"error": "Missing required fields"}, 400

        review = Review(
            client_id=user_id,
            barber_id=barber_id,
            rating=rating,
            comment=comment
        )

        db.session.add(review)
        db.session.commit()
        return review.to_dict(), 201

   

# -------- Appointments (Full CRUD) --------
class AppointmentList(Resource):
    def get(self):
        return [appt.to_dict() for appt in Appointment.query.all()], 200

    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        data = request.get_json()
        if not data:
            return {"error": "Invalid input"}, 400

        try:
            date_time = datetime.strptime(data["date_time"], "%Y-%m-%dT%H:%M")

            appt = Appointment(
                client_id=user_id,  # Use user_id from session
                barber_id=data["barber_id"],
                service_id=data["service_id"],
                date_time=date_time,
                status=data.get("status", "Scheduled")
            )
            db.session.add(appt)
            db.session.commit()
            
            return appt.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400

class AppointmentDetail(Resource):
    def get(self, id):
        appt = Appointment.query.get(id)
        if not appt:
            return {"error": "Appointment not found"}, 404
        return appt.to_dict(), 200

    def patch(self, id):
        appt = Appointment.query.get(id)                                                                                                                                                                                                                 
        if not appt:
            return {"error": "Appointment not found"}, 404

        data = request.get_json()
        if not data:
            return {"error": "Invalid input"}, 400

        try:
            for attr in ["client_id", "barber_id", "service_id", "status"]:
                if attr in data:
                    setattr(appt, attr, data[attr])
            if "date_time" in data:
                appt.date_time = datetime.strptime(data["date_time"], "%Y-%m-%dT%H:%M")

            db.session.commit()
            return appt.to_dict(), 200
        except Exception as e:
            return {"error": str(e)}, 400

    def delete(self, id):
        appt = Appointment.query.get(id)
        if not appt:
            return {"error": "Appointment not found"}, 404
        db.session.delete(appt)
        db.session.commit()
        return {"message": "Appointment deleted"}, 204
    

# -------- Client Appointments --------
# ReviewsByClient resource: Fetch reviews for a specific client
class ReviewsByClient(Resource):
    @login_required
    def get(self, client_id):
        # Ensure users can only view their own reviews
        if current_user.id != client_id:
            return {"error": "Unauthorized"}, 403

        reviews = Review.query.filter_by(client_id=client_id).all()

        review_data = [
            {
                "id": review.id,
                "rating": review.rating,
                "comment": review.comment,
                "barber": {
                    "id": review.barber.id,
                    "name": review.barber.name,
                },
            }
            for review in reviews
        ]

        return jsonify(review_data)

# ClientAppointments resource: Fetch appointments for a specific client
class ClientAppointments(Resource):
    def get(self, client_id):
        appts = Appointment.query.filter_by(client_id=client_id).all()
        return [appt.to_dict() for appt in appts], 200
