import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Interaction from '../models/Interaction.js';
import Relationship from '../models/Relationship.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all interactions for current user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const interactions = await Interaction.find({ userId: req.userId }).sort({ date: -1 });
    res.json(interactions);
  } catch (error) {
    console.error('Get interactions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get interactions for a specific relationship
router.get('/relationship/:relationshipId', async (req: AuthRequest, res: Response) => {
  try {
    const interactions = await Interaction.find({
      relationshipId: req.params.relationshipId,
      userId: req.userId
    }).sort({ date: -1 });

    res.json(interactions);
  } catch (error) {
    console.error('Get relationship interactions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create interaction
router.post(
  '/',
  [
    body('relationshipId').notEmpty(),
    body('type').isIn(['Call', 'Email', 'Meeting']),
    body('date').isISO8601(),
    body('outcome').isIn(['Positive', 'Neutral', 'No Response']),
    body('tone').isIn(['Energizing', 'Neutral', 'Draining'])
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Verify relationship belongs to user
      const relationship = await Relationship.findOne({
        _id: req.body.relationshipId,
        userId: req.userId
      });

      if (!relationship) {
        return res.status(404).json({ error: 'Relationship not found' });
      }

      const interaction = new Interaction({
        ...req.body,
        userId: req.userId
      });

      await interaction.save();

      // Update relationship's updatedAt
      relationship.updatedAt = new Date();
      await relationship.save();

      res.status(201).json(interaction);
    } catch (error) {
      console.error('Create interaction error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update interaction
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const interaction = await Interaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!interaction) {
      return res.status(404).json({ error: 'Interaction not found' });
    }

    res.json(interaction);
  } catch (error) {
    console.error('Update interaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete interaction
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const interaction = await Interaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!interaction) {
      return res.status(404).json({ error: 'Interaction not found' });
    }

    res.json({ message: 'Interaction deleted' });
  } catch (error) {
    console.error('Delete interaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
