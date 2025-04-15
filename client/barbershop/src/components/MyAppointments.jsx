import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function MyAppointments() {
  const { user } = useUser();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5555/clients/${user.id}/appointments`)
        .then((res) => res.json())
        .then(setAppointments);
    }
  }, [user]);

  const now = new Date();

  const upcoming = appointments.filter(appt => new Date(appt.date_time) >= now);
  const past = appointments.filter(appt => new Date(appt.date_time) < now);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">My Appointments</h2>

      <section>
        <h3 className="font-semibold mb-2">Upcoming Appointments</h3>
        {upcoming.length ? upcoming.map(renderAppointment) : <p>No upcoming appointments.</p>}
      </section>

      <hr className="my-4" />

      <section>
        <h3 className="font-semibold mb-2">Past Appointments</h3>
        {past.length ? past.map(renderAppointment) : <p>No past appointments.</p>}
      </section>
    </div>
  );

  function renderAppointment(appt) {
    return (
      <div key={appt.id} className="p-3 mb-2 rounded-lg shadow-sm bg-white">
        <p><strong>Date:</strong> {new Date(appt.date_time).toLocaleString()}</p>
        <p><strong>Barber:</strong> {appt.barber}</p>
        <p><strong>Service:</strong> {appt.service}</p>
        <p><strong>Status:</strong> {appt.status}</p>
        {new Date(appt.date_time) >= now && (
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleCancel(appt.id)} className="btn-sm bg-red-500 text-white">Cancel</button>
            {/* Add reschedule logic here */}
          </div>
        )}
      </div>
    );
  }

  function handleCancel(id) {
    fetch(`http://localhost:5555/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Cancelled" }),
    })
      .then((res) => res.json())
      .then(() => {
        setAppointments((prev) => prev.map((appt) =>
          appt.id === id ? { ...appt, status: "Cancelled" } : appt
        ));
      });
  }
}
