const db = require('../config/db');
exports.getAllDestinations = async (req, res) => {
  try {
    const snapshot = await db.collection('destinations').get();
    const destinations = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (!data.userId) { 
        destinations.push({ id: doc.id, ...data });
      }
    });

    res.status(200).json({ status: 'success', data: { destinations } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
exports.getMyDestinations = async (req, res) => {
  try {
    const userId = req.user.uid; 
    const snapshot = await db.collection('destinations')
      .where('userId', '==', userId)
      .get();

    const myVacations = [];
    snapshot.forEach(doc => {
      myVacations.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      status: 'success',
      data: myVacations
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
exports.createDestination = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
        return res.status(401).json({ message: "Utilizator neautentificat" });
    }

    const newDestinationData = {
      ...req.body,           
      userId: req.user.uid,   
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('destinations').add(newDestinationData);

    res.status(201).json({
      status: 'success',
      data: { id: docRef.id, ...newDestinationData }
    });

  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
exports.getDestinationById = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await db.collection('destinations').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ status: 'fail', message: 'Destinația nu a fost găsită' });
    }

    res.status(200).json({
      status: 'success',
      data: { id: doc.id, ...doc.data() }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};