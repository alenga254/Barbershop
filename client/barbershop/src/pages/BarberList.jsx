// src/components/BarberList.jsx
import { useEffect, useState } from "react";
import BarberCard from "../components/BarberCard";

function BarberList() {
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5555/barbers", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => setBarbers(data))
      .catch((err) => console.error("Failed to fetch barbers:", err));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {barbers.map((barber) => (
        <BarberCard key={barber.id} barber={barber} />
      ))}
    </div>
  );
}

export default BarberList;
