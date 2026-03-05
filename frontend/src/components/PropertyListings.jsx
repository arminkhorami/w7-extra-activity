import PropertyListing from "./PropertyListing";

const PropertyListings = () => {
  return (
    <div className="rental-list">
      <PropertyListing property={{ title: "Sample Property", type: "Apartment", price: 250000 }} />
    </div>
  );
};

export default PropertyListings;
