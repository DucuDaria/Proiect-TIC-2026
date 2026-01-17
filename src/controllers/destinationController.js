const { db } = require('../config/db');

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const validateTripData = (data) => {
  const errors = [];

  if (!data.country || typeof data.country !== 'string' || data.country.trim().length < 3) {
    errors.push("Numele țării trebuie să aibă minim 3 caractere.");
  }

  if (data.image && !isValidUrl(data.image)) {
    errors.push("URL-ul imaginii de copertă este invalid.");
  }

  if (data.description && data.description.trim().length < 10) {
    errors.push("Descrierea trebuie să aibă minim 10 caractere.");
  }

  if (data.cities && Array.isArray(data.cities)) {
    data.cities.forEach((city, index) => {
      if (!city.name || city.name.trim() === '') {
        errors.push(`Orașul #${index + 1} nu are nume.`);
      }
      if (city.image && !isValidUrl(city.image)) {
        errors.push(`Imaginea pentru orașul ${city.name || index} este invalidă.`);
      }
      
      if (city.attractions && Array.isArray(city.attractions)) {
        city.attractions.forEach((attr, aIndex) => {
          if (!attr.name || attr.name.trim() === '') {
            errors.push(`Atracția #${aIndex + 1} din ${city.name} nu are nume.`);
          }
          if (attr.price === undefined || attr.price === null || isNaN(attr.price) || Number(attr.price) < 0) {
            errors.push(`Prețul pentru ${attr.name} trebuie să fie un număr pozitiv.`);
          }
        });
      }
    });
  }

  if (data.itinerary && typeof data.itinerary === 'object') {
    Object.entries(data.itinerary).forEach(([day, items]) => {
      items.forEach((item, idx) => {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(item.time)) {
          errors.push(`Ziua ${day}, element ${idx + 1}: Ora trebuie să fie format HH:MM (ex: 14:30).`);
        }
        if (!item.name || item.name.trim() === '') {
          errors.push(`Ziua ${day}, element ${idx + 1}: Numele activității lipsește.`);
        }
        if (Number(item.price) < 0) {
          errors.push(`Ziua ${day}, element ${idx + 1}: Prețul nu poate fi negativ.`);
        }
      });
    });
  }

  return errors;
};

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
    const snapshot = await db.collection('destinations').where('userId', '==', userId).get();
    const myVacations = [];
    snapshot.forEach(doc => {
      myVacations.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json({ status: 'success', data: myVacations });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.createDestination = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
        return res.status(401).json({ message: "Utilizator neautentificat" });
    }

    const errors = validateTripData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ status: 'fail', message: 'Validare eșuată', errors });
    }

    const newDestinationData = {
      ...req.body,           
      userId: req.body.isPublic ? null : req.user.uid,
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

exports.updateDestination = async (req, res) => {
    try {
      const id = req.params.id;
      const docRef = db.collection('destinations').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ message: "Vacanța nu există." });
      }

      const data = doc.data();
      const isOwner = data.userId === req.user.uid;
      const isAdmin = req.user.email === "admin@wanderlust.com";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Nu aveți permisiunea de a modifica această vacanță." });
      }

      const errors = validateTripData(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ status: 'fail', message: 'Validare eșuată', errors });
      }

      const updateData = { ...req.body };
      delete updateData.id;
      
      await docRef.update(updateData);
      
      res.status(200).json({ status: 'success', message: 'Actualizat cu succes.' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
  
exports.deleteDestination = async (req, res) => {
    try {
      const id = req.params.id;
      const docRef = db.collection('destinations').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ message: "Destinația nu există." });
      }

      const data = doc.data();
      const isOwner = data.userId === req.user.uid;
      const isAdmin = req.user.email === "admin@wanderlust.com";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Nu aveți permisiunea de a șterge." });
      }

      await docRef.delete();
      res.status(200).json({ status: 'success', message: 'Șters.' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};