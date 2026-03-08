import { useEffect, useState } from "react";
import PropertyListing from "./PropertyListing";
import axios from "axios";

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/properties");
        setProperties(response.data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
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