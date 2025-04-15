import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function SubmitReview() {
  const { user } = useUser();
  const [barbers, setBarbers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedBarberId, setSelectedBarberId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch barbers from user's appointments
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5555/appointments/client/${user.id}`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch appointments");
          return res.json();
        })
        .then((data) => {
          const uniqueBarbers = Array.from(
            new Map(data.map((appt) => [appt.barber.id, appt.barber])).values()
          );
          setBarbers(uniqueBarbers);
        })
        .catch((err) => {
          console.error("Failed to load barbers:", err);
          setError("Could not load barbers from your appointments.");
        });
    }
  }, [user]);

  // Fetch user's previous reviews
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5555/reviews/client/${user.id}`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch reviews");
          return res.json();
        })
        .then((data) => setReviews(data))
        .catch((err) => {
          console.error("Failed to load reviews:", err);
          setError("Could not load previous reviews.");
        });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBarberId || !rating || !comment.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const newReview = {
      client_id: user.id,
      barber_id: parseInt(selectedBarberId),
      rating,
      comment: comment.trim(),
    };

    fetch("http://localhost:5555/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newReview),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit review");
        return res.json();
      })
      .then((newData) => {
        setSuccessMessage("Review submitted!");
        setReviews((prev) => [...prev, newData]);
        setSelectedBarberId("");
        setRating(0);
        setComment("");
        setError("");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => {
        console.error("Review submission error:", err);
        setError("Could not submit review.");
      });
  };

  const renderStars = (stars, clickable = false) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => {
          const starNum = i + 1;
          return (
            <span
              key={starNum}
              className={`cursor-pointer text-xl ${
                starNum <= stars ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => clickable && setRating(starNum)}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Submit a Review</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {successMessage && (
        <p className="text-green-600 text-sm mb-2">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Barber:</label>
          <select
            value={selectedBarberId}
            onChange={(e) => setSelectedBarberId(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded"
          >
            <option value="">-- Select --</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Rating:</label>
          {renderStars(rating, true)}
        </div>

        <div>
          <label className="block text-sm font-medium">Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>

      {reviews.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Your Previous Reviews</h3>
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="bg-gray-100 p-4 rounded shadow-sm"
              >
                <p className="font-medium">
                  Barber:{" "}
                  <span className="text-gray-700">
                    {review.barber?.name || "Unknown"}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Rating:</span>
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm mt-1">Comment: {review.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
