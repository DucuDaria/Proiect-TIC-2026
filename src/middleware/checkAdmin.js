const ADMIN_EMAIL = "admin@wanderlust.com";

const checkAdmin = (req, res, next) => {
  if (req.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ message: "Acces interzis. Doar pentru administratori." });
  }
  next();
};

module.exports = checkAdmin;