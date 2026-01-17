const { admin, db } = require('../config/db');
exports.getAllUsers = async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers(1000);
    const users = listUsersResult.users.map(userRecord => ({
      uid: userRecord.uid,
      email: userRecord.email,
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime
    }));
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllBookings = async (req, res) => {
  try {
    const snapshot = await db.collection('destinations').get();
    const bookings = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.userId) bookings.push({ id: doc.id, ...data });
    });
    res.status(200).json({ status: 'success', data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const targetUid = req.params.uid; 
    
    const snapshot = await db.collection('destinations')
      .where('userId', '==', targetUid)
      .get();

    const userBookings = [];
    snapshot.forEach(doc => {
      userBookings.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ status: 'success', data: userBookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};