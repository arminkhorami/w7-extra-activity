const AddPropertyPage = () => {
  const submitForm = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="create">
      <h2>Add a New Property</h2>
      <form onSubmit={submitForm}>
        <label>Title:</label>
        <input type="text" required />
        <label>Type:</label>
        <select>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Commercial">Commercial</option>
        </select>
        <label>Description:</label>
        <textarea required></textarea>
        <label>Price:</label>
        <input type="number" step="0.01" min="0" required />
        <button>Add Property</button>
      </form>
    </div>
  );
};

export default AddPropertyPage;
