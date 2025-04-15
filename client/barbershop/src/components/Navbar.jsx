import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  function handleLogout() {
    fetch("http://localhost:5555/logout", {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        setUser(null);
        navigate("/login");
      })
      .catch((err) => console.error("Logout error:", err));
  }

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/home">Home</Link>
        <Link to="/barbers">Barbers</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/my-appointments">My Appointments</Link> 
      </div>

      <div className="flex items-center gap-4">
        {user?.name && (
          <span className="text-sm font-medium">Hi, {user.name} 👋</span>
        )}
        {user && (
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
