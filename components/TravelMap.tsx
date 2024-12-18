import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const DynamicMap = dynamic(
  () => import("./LeafletMap"), 
  { ssr: false } 
);

const TravelMap = ({ coordinates }: { coordinates: [number, number] }) => {
  return (
    <div style={{ height: "400px", width: "100%" }}>
      <DynamicMap coordinates={coordinates} />
    </div>
  );
};

export default TravelMap;
