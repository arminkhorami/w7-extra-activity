import React from "react";
import { useNavigate } from "react-router-dom";

const AddPropertyPage = ({ user }) => {
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();

    // 1️⃣ چک کن کاربر لاگین هست
    if (!user) {
      alert("You must be logged in to add a property");
      navigate("/login");
      return;
    }

    // 2️⃣ جمع کردن اطلاعات فرم
    const propertyData = {
      title: e.target.title.value,
      type: e.target.type.value,
      description: e.target.description.value,
      price: parseFloat(e.target.price.value),
    };

    try {
      // 3️⃣ ارسال به سرور با JWT
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) throw new Error("Failed to add property");

      alert("Property added successfully!");
      navigate("/"); // بعد اضافه شدن ملک برو به صفحه اصلی

    } catch (err) {
      console.error(err);
      alert("Error adding property");
    }
  };

  return (
    <div className="create">
      <h2>Add a New Property</h2>
      <form onSubmit={submitForm}>
        <label>Title:</label>
        <input name="title" type="text" required />

        <label>Type:</label>
        <select name="type">
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Commercial">Commercial</option>
        </select>

        <label>Description:</label>
        <textarea name="description" required></textarea>

        <label>Price:</label>
        <input name="price" type="number" step="0.01" min="0" required />

        <button type="submit">Add Property</button>
      </form>
    </div>
  );
};

export default AddPropertyPage;