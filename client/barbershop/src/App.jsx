import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BarberList from "./pages/BarberList";
import BookAppointment from "./pages/BookAppointment";
import SubmitReview from "./pages/SubmitReview";
import AuthPage from "./pages/AuthPage";
import MyAppointments from "./components/MyAppointments";

function App() {
  const { user, loading } = useUser();

  // Show loading indicator if user data is still being fetched
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <Router>
      {/* Navbar only appears if the user is logged in */}
      {user && <Navbar />}

      <Routes>
        {/* Default route displays AuthPage */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected routes */}
        {user && (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/barbers" element={<BarberList />} />
            <Route path="/appointments" element={<BookAppointment />} />
            <Route path="/reviews" element={<SubmitReview />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="*" element={<Navigate to="/home" replace />} /> {/* Redirect to home */}
          </>
        )}

        {/* Fallback route for all other pages */}
        {!user && <Route path="*" element={<Navigate to="/" replace />} />}
      </Routes>
    </Router>
  );
}

export default App;
