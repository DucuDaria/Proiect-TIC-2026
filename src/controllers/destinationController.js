// Date pentru testare - Mock Data
const destinations = [
  {
    id: 1,
    country: "Italia",
    description: "Patria pastelor si a istoriei romane",
    cities: ["Roma", "Milano", "Veneția", "Florenta"]
  },
  {
    id: 2,
    country: "Franța",
    description: "Romantism, moda si arta",
    cities: ["Paris", "Lyon", "Nisa"]
  },
  {
    id: 3,
    country: "Japonia",
    description: "Unde traditia intalneste viitorul",
    cities: ["Tokyo", "Kyoto", "Osaka"]
  }
];

exports.getAllDestinations = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: destinations.length,
    data: { destinations }
  });
};
exports.createDestination = (req, res) => {
  const newId = destinations.length + 1;
  const newDestination = Object.assign({ id: newId }, req.body);
  destinations.push(newDestination);
  res.status(201).json({
    status: 'success',
    message: 'Destinație adăugată temporar!',
    data: { destination: newDestination }
  });
};