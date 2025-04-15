// src/components/BarberCard.jsx
export default function BarberCard({ barber }) {
    return (
      <div className="p-4 shadow-md rounded-xl">
        <img src="https://via.placeholder.com/100" className="rounded-full" />
        <h3 className="text-lg font-semibold mt-2">{barber.name}</h3>
        <p>{barber.specialty || "No specialty"}</p>
        <p>⭐ 4.8</p>
        <button className="btn mt-2">Book</button>
      </div>
    );
  }
  