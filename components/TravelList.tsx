type Travel = {
    id: string;
    destination: string;
    description?: string;
    date?: string;
  };
  
  const TravelList = ({
    travels,
    onSelect,
  }: {
    travels: Travel[];
    onSelect: (travel: Travel) => void;
  }) => (
    <div className="grid grid-cols-3 gap-6">
      {travels.map((travel) => (
        <div
          key={travel.id}
          onClick={() => onSelect(travel)}
          className="bg-white shadow p-6 rounded-md cursor-pointer hover:shadow-lg"
        >
          <h3 className="text-lg font-bold">{travel.destination}</h3>
          <p>{travel.description || "Sem descrição"}</p>
          <p className="text-sm text-gray-400">{travel.date || "Sem data"}</p>
        </div>
      ))}
    </div>
  );
  
  export default TravelList;
  