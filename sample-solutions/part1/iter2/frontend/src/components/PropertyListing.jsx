import { Link } from "react-router-dom";

const PropertyListing = ({ property }) => {
  return (
    <div className="rental-preview">
      <Link to={`/properties/${property._id}`}>
        <h2>{property.title}</h2>
        <p>Type: {property.type}</p>
        <p>Price: ${property.price}</p>
      </Link>
    </div>
  );
};

export default PropertyListing;
