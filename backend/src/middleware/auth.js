const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from request header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token. Please login.' });
  }

  // Extract token from "Bearer eyJhbG..."
  const token = authHeader.split(' ')[1];

  try {
    // Verify token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded; // { userId, email }

    next(); // Continue to the route
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};