import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Relationship from '../models/Relationship.js';
import Interaction from '../models/Interaction.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all relationships for current user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const relationships = await Relationship.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(relationships);
  } catch (error) {
    console.error('Get relationships error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single relationship
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const relationship = await Relationship.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found' });
    }

    res.json(relationship);
  } catch (error) {
    console.error('Get relationship error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create relationship
router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('organization').trim().notEmpty(),
    body('stage').isIn(['Exploring', 'Active', 'At Risk', 'Completed'])
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const relationship = new Relationship({
        ...req.body,
        userId: req.userId
      });

      await relationship.save();
      res.status(201).json(relationship);
    } catch (error) {
      console.error('Create relationship error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update relationship
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const relationship = await Relationship.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found' });
    }

    res.json(relationship);
  } catch (error) {
    console.error('Update relationship error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete relationship (and its interactions)
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const relationship = await Relationship.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found' });
    }

    // Delete associated interactions
    await Interaction.deleteMany({ relationshipId: req.params.id });

    res.json({ message: 'Relationship deleted' });
  } catch (error) {
    console.error('Delete relationship error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
