import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Apartment");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setType(data.type);
          setDescription(data.description);
          setPrice(data.price);
        } else {
          console.error("Failed to fetch property");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    };

    fetchProperty();
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();

    const property = { title, type, description, price: Number(price) };
    const stored = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${stored?.token}`,
        },
        body: JSON.stringify(property),
      });

      if (response.ok) {
        navigate(`/properties/${id}`);
      } else {
        console.error("Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <div className="create">
      <h2>Update Property</h2>
      <form onSubmit={submitForm}>
        <label>Title:</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Commercial">Commercial</option>
        </select>
        <label>Description:</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          min="0"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button>Update Property</button>
      </form>
    </div>
  );
};

export default EditPropertyPage;
