const express = require('express');
const cors = require('cors');        
const helmet = require('helmet');    
const morgan = require('morgan');    
const config = require('./config/config');
const db = require('./config/db');
const destinationRoutes = require('./routes/destinationRoutes');
const adminRoutes = require('./routes/adminRoutes'); 

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/destinations', destinationRoutes);
app.use('/api/admin', adminRoutes); 

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Wanderlust Planner API is running!',
    env: config.env
  });
});

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`\ Server running on port ${config.port}`);
    console.log(`Environment: ${config.env}`);
    console.log(`Security & Logging active\n`);
  });
}

module.exports = app;