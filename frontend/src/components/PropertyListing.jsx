const PropertyListing = ({ property }) => {
  return (
    <div className="rental-preview">
      <h2>{property.title}</h2>
      <p>Type: {property.type}</p>
      <p>Price: ${property.price}</p>
    </div>
  );
};

export default PropertyListing;
