// src/components/BarberCard.jsx
function BarberCard({ barber }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <img
        src={barber.image_url}
        alt={barber.name}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />
      <h2 className="text-xl font-semibold">{barber.name}</h2>
      <p className="text-gray-600">{barber.specialty}</p>
      <p className="text-sm text-gray-500">{barber.specialization}</p>
      <p className="text-sm text-gray-500">{barber.email}</p>
    </div>
  );
}

export default BarberCard;
