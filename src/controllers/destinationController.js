const db = require('../config/db');

exports.getAllDestinations = async (req, res) => {
  try {
    const snapshot = await db.collection('destinations').get();
    const destinations = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      destinations.push({ id: doc.id, ...data });
    });
    res.status(200).json({ status: 'success', data: { destinations } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createDestination = async (req, res) => {
  try {
    const newDoc = await db.collection('destinations').add(req.body);
    res.status(201).json({ status: 'success', data: { id: newDoc.id, ...req.body } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
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