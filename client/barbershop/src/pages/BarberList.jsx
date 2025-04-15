import { useEffect, useState } from "react";
import BarberCard from "../components/BarberCard";

export default function BarberList() {
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5555/barbers")
      .then((r) => r.json())
      .then(setBarbers);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Barber List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {barbers.map((barber) => (
          <BarberCard key={barber.id} barber={barber} />
        ))}
      </div>
    </div>
  );
}
