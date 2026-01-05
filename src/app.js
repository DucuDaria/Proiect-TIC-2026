const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Pentru logging
const helmet = require('helmet'); // Pentru securitate
const config = require('./config/config');

const app = express();

// --- Implementare Middleware-uri Esențiale ---
app.use(helmet());       // Securitate
app.use(cors());         // Permite frontend-ului să se conecteze
app.use(morgan('dev'));  // Sistemul de logging (arată cererile în consolă)
app.use(express.json()); // Permite citirea JSON-urilor

// Rută simplă de test
app.get('/', (req, res) => {
  res.json({
    message: 'Wanderlust Planner API is running! ✈️',
    env: config.env
  });
});

// Pornire server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});

module.exports = app;