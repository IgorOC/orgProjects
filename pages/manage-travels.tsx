import { useState, useEffect } from "react";
import { db, auth } from "../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, query, where, doc } from "firebase/firestore";
import axios from "axios";
import { FaPlusCircle, FaTrash, FaSearchLocation, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";

type Travel = {
  id: string;
  destination: string;
  description?: string;
  date: string;
  locationName?: string;
  lat: number | null;
  lng: number | null;
  uid: string;
};

export default function ManageTravels() {
  const router = useRouter();
  const [travels, setTravels] = useState<Travel[]>([]);
  const [destination, setDestination] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);

  useEffect(() => {
    const fetchTravels = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "travels"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const travelsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Travel, "id">),
      }));

      setTravels(travelsData);
    };

    fetchTravels();
  }, []);

  const handleCreateTravel = async () => {
    if (!destination || !date) return alert("Destino e data são obrigatórios!");
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, "travels"), {
        destination,
        description,
        date,
        locationName,
        lat: latitude,
        lng: longitude,
        uid: user.uid,
      });

      setTravels((prev) => [
        ...prev,
        {
          id: docRef.id,
          destination,
          description,
          date,
          locationName,
          lat: latitude,
          lng: longitude,
          uid: user.uid,
        },
      ]);
      alert("Viagem criada com sucesso!");
      resetForm();
    } catch (error) {
      console.error("Erro ao criar viagem:", error);
    }
  };

  const resetForm = () => {
    setDestination("");
    setDescription("");
    setDate("");
    setLocationName("");
    setLatitude(null);
    setLongitude(null);
  };

  const handleDeleteTravel = async (id: string) => {
    try {
      await deleteDoc(doc(db, "travels", id));
      setTravels((prev) => prev.filter((travel) => travel.id !== id));
      alert("Viagem excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir viagem:", error);
    }
  };

  const handleSearchLocation = async () => {
    if (!locationName) return alert("Digite um local para buscar!");
    setLoadingLocation(true);

    try {
      const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: {
          q: locationName,
          key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY,
        },
      });

      const { results } = response.data;
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry;
        setLatitude(lat);
        setLongitude(lng);
        alert(`Coordenadas encontradas: ${lat}, ${lng}`);
      } else {
        alert("Nenhum local encontrado para essa busca.");
      }
    } catch (error) {
      console.error("Erro ao buscar localização:", error);
      alert("Erro ao buscar localização.");
    } finally {
      setLoadingLocation(false);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded mb-6 hover:bg-gray-800 transition duration-300"
      >
        <FaArrowLeft />
        Voltar ao Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">Planejar Viagens</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Criar Nova Viagem</h2>
          <input
            type="text"
            placeholder="Destino"
            className="border p-2 rounded w-full mb-4"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <textarea
            placeholder="Descrição"
            className="border p-2 rounded w-full mb-4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded w-full mb-4"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Buscar Localização"
              className="border p-2 rounded flex-1"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
            <button
              onClick={handleSearchLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            >
              <FaSearchLocation />
            </button>
          </div>
          {loadingLocation && <p className="text-gray-500">Buscando localização...</p>}
          {latitude && longitude && (
            <p className="text-sm text-gray-600">Coordenadas: {latitude}, {longitude}</p>
          )}
          <button
            onClick={handleCreateTravel}
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            <FaPlusCircle className="inline-block mr-2" />
            Criar Viagem
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Minhas Viagens</h2>
          <ul className="space-y-4">
            {travels.map((travel) => (
              <li
                key={travel.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold">{travel.destination}</h3>
                  <p>{travel.description || "Sem descrição"}</p>
                  <p className="text-sm text-gray-500">Data: {travel.date}</p>
                  <p className="text-sm text-gray-500">
                    Localização: {travel.locationName || "Não informada"}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTravel(travel.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
