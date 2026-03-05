import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropertyListing from "./PropertyListing";

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties");
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="rental-list">
      {properties.map((property) => (
        <Link
          to={`/properties/${property._id}`}
          key={property._id}
          className="rental-link"
        >
          <PropertyListing property={property} />
        </Link>
      ))}
    </div>
  );
};

export default PropertyListings;
