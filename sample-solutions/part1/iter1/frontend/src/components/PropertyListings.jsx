import { useState, useEffect } from "react";
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
        <PropertyListing key={property._id} property={property} />
      ))}
    </div>
  );
};

export default PropertyListings;
