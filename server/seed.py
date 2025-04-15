from faker import Faker
from models import Client, Barber, Service, Appointment, Review
from config import db
from datetime import datetime
import random

# Initialize Faker instance
fake = Faker()

# Clear existing data (optional but good for development)
def clear_data():
    db.session.query(Client).delete()
    db.session.query(Barber).delete()
    db.session.query(Service).delete()
    db.session.query(Appointment).delete()
    db.session.query(Review).delete()
    db.session.commit()

# Seed Clients
def seed_clients(num_clients=10):
    clients = []
    for _ in range(num_clients):
        name = fake.name()
        email = fake.email()
        password = "password"  
        
        client = Client(
            name=name,
            email=email
        )
        client.set_password(password)
        clients.append(client)
    
    db.session.bulk_save_objects(clients)
    db.session.commit()

# Seed Barbers
def seed_barbers(num_barbers=5):
    barbers = []
    for _ in range(num_barbers):
        name = fake.name()
        specialization = fake.word()
        email = fake.email()
        password = "password"  
        
        barber = Barber(
            name=name,
            specialization=specialization,
            email=email
        )
        barber.set_password(password)
        barbers.append(barber)

    db.session.bulk_save_objects(barbers)
    db.session.commit()

# Seed Services
def seed_services():
    services = [
        {"name": "Haircut", "price": 15.0, "description": fake.sentence()},
        {"name": "Shave", "price": 10.0, "description": fake.sentence()},
        {"name": "Facial", "price": 20.0, "description": fake.sentence()},
        {"name": "Hair Treatment", "price": 25.0, "description": fake.sentence()},
        {"name": "Beard Trim", "price": 12.0, "description": fake.sentence()}
    ]

    for service in services:
        service_obj = Service(
            name=service["name"],
            price=service["price"],
            description=service["description"]
        )
        db.session.add(service_obj)

    db.session.commit()

# Seed Appointments
def seed_appointments(num_appointments=20):
    appointments = []
    clients = Client.query.all()
    barbers = Barber.query.all()
    services = Service.query.all()

    for _ in range(num_appointments):
        client = random.choice(clients)
        barber = random.choice(barbers)
        service = random.choice(services)
        date_time = fake.date_this_year()  # Generate a random date
        status = random.choice(["Scheduled", "Completed", "Cancelled"])

        appointment = Appointment(
            client_id=client.id,
            barber_id=barber.id,
            service_id=service.id,
            date_time=date_time,
            status=status
        )
        appointments.append(appointment)

    db.session.bulk_save_objects(appointments)
    db.session.commit()

# Seed Reviews
def seed_reviews(num_reviews=30):
    reviews = []
    clients = Client.query.all()
    barbers = Barber.query.all()
    appointments = Appointment.query.all()

    for _ in range(num_reviews):
        client = random.choice(clients)
        barber = random.choice(barbers)
        appointment = random.choice(appointments)
        rating = random.randint(1, 5)
        comment = fake.sentence()

        review = Review(
            client_id=client.id,
            barber_id=barber.id,
            appointment_id=appointment.id,
            rating=rating,
            comment=comment
        )
        reviews.append(review)

    db.session.bulk_save_objects(reviews)
    db.session.commit()

# Main function to seed data
def seed():
    clear_data()  
    seed_clients()
    seed_barbers()
    seed_services()
    seed_appointments()
    seed_reviews()

    print("Database seeded successfully.")

if __name__ == "__main__":
    from config import app 
    with app.app_context():
        seed()