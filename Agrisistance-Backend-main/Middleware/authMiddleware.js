import jwt from 'jsonwebtoken';
import UnauthenticatedError from '../Errors/UnauthenticatedError.js';

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.user_id };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

export default authenticateUser;