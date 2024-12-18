import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// Corrigir problema de ícones do Leaflet
import L from "leaflet";

const defaultIcon = L.icon({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Define o ícone padrão para todos os marcadores
L.Marker.prototype.options.icon = defaultIcon;

const LeafletMap = ({ coordinates }: { coordinates: LatLngExpression }) => (
  <MapContainer
    center={coordinates}
    zoom={13}
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={coordinates}>
      <Popup>Aqui está sua viagem!</Popup>
    </Marker>
  </MapContainer>
);

export default LeafletMap;
