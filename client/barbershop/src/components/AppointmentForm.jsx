import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

export default function BookAppointment() {
  const { user } = useUser();
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    barber_id: "",
    service_id: "",
    date: "",
    time: "",
    status: "Pending",
  });

  useEffect(() => {
    fetch("http://localhost:5555/barbers")
      .then((r) => r.json())
      .then(setBarbers);

    fetch("http://localhost:5555/services")
      .then((r) => r.json())
      .then(setServices);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    
    if (!form.barber_id || !form.service_id) {
      alert("Please select a barber and a service.");
      return;
    }

    if (!form.date || !form.time) {
      alert("Please select both a date and a time.");
      return;
    }

    const dateTimeStr = `${form.date}T${form.time}`;
    const appointmentDateTime = new Date(dateTimeStr);
    const now = new Date();

    if (appointmentDateTime <= now) {
      alert("You cannot book an appointment in the past. Please select a future date and time.");
      return;
    }

    const appointmentData = {
    
      barber_id: parseInt(form.barber_id),
      service_id: parseInt(form.service_id),
      date_time: dateTimeStr,
      status: form.status,
    };

    fetch("http://localhost:5555/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(appointmentData),
    })
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error("Failed to book appointment");
      })
      .then(() => {
        alert("Appointment booked successfully!");
        setForm({
          barber_id: "",
          service_id: "",
          date: "",
          time: "",
          status: "Pending",
        });
      })
      .catch(async (err) => {
        const errorResponse = await err.response?.json();
        console.error("Error response:", errorResponse);
        alert(`Error: ${errorResponse?.error || err.message}`);
      });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-xl"
    >
      <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>

      <p className="mb-2 text-gray-700 font-medium">Client: {user?.name}</p>

      <select
        name="barber_id"
        value={form.barber_id}
        onChange={handleChange}
        className="input w-full mb-3"
        required
      >
        <option value="">Select Barber</option>
        {barbers.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <select
        name="service_id"
        value={form.service_id}
        onChange={handleChange}
        className="input w-full mb-3"
        required
      >
        <option value="">Select Service</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="input w-full mb-3"
        required
      />

      <input
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
        className="input w-full mb-3"
        required
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="input w-full mb-3"
      >
        <option>Pending</option>
        <option>Confirmed</option>
        <option>Cancelled</option>
      </select>

      <button type="submit" className="btn w-full">
        Book Appointment
      </button>
    </form>
  );
}