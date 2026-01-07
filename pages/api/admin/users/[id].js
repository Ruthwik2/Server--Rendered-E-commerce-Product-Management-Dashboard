import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { authMiddleware } from '../../../../middleware/authMiddleware';

async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Prevent deleting yourself
      if (req.user.userId === id) {
        return res.status(400).json({ error: 'You cannot delete your own account' });
      }

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default authMiddleware(handler);
