import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    res.status(401);
    throw new Error('No token, access denied');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // contains { id }

    next();
  } catch (err) {
    res.status(401);
    throw new Error('Token invalid');
  }
};

export default protect;
