import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to the Barbershop System{user?.name ? `, ${user.name}` : ""} 💈
      </h1>
      <p className="mb-6 text-gray-600">
        Book appointments, explore barbers, and leave your reviews with ease.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/barbers" className="btn">
          View Barbers
        </Link>
        <Link to="/appointments" className="btn">
          Book Appointment
        </Link>
        <Link to="/reviews" className="btn">
          Submit Review
        </Link>
      </div>
    </div>
  );
}
