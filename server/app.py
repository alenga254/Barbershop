from flask import request, session
from flask_restful import Resource
from config import app, db, api, login_manager
from models import Client, Barber, Service, Appointment, Review
from resources import (
    ClientList, BarberList, ServiceList, ReviewList, AppointmentList,
    AppointmentDetail, ClientAppointments, ReviewsByClient,
    SignupResource, LoginResource, LogoutResource, CheckSession
)

@login_manager.user_loader
def load_user(user_id):
    return Client.query.get(int(user_id))

# Routes
api.add_resource(SignupResource, "/signup")
api.add_resource(LoginResource, "/login")
api.add_resource(LogoutResource, "/logout")
api.add_resource(CheckSession, "/check_session")  
api.add_resource(ClientList, "/clients")
api.add_resource(BarberList, "/barbers")
api.add_resource(ServiceList, "/services")
api.add_resource(ReviewList, "/reviews")
api.add_resource(AppointmentList, "/appointments")
api.add_resource(AppointmentDetail, "/appointments/<int:id>")
api.add_resource(ClientAppointments, '/appointments/client/<int:client_id>')
api.add_resource(ReviewsByClient, '/reviews/client/<int:client_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
