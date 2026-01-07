import { verifyToken, getTokenFromRequest } from '../lib/auth';

export function authMiddleware(handler) {
  return async (req, res) => {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded;
    return handler(req, res);
  };
}