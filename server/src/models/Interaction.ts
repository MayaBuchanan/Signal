import mongoose, { Schema, Document } from 'mongoose';

export interface IInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  relationshipId: mongoose.Types.ObjectId;
  type: 'Call' | 'Email' | 'Meeting';
  date: Date;
  outcome: 'Positive' | 'Neutral' | 'No Response';
  tone: 'Energizing' | 'Neutral' | 'Draining';
  reflection: string;
  createdAt: Date;
  updatedAt: Date;
}

const InteractionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    relationshipId: {
      type: Schema.Types.ObjectId,
      ref: 'Relationship',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['Call', 'Email', 'Meeting'],
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    outcome: {
      type: String,
      enum: ['Positive', 'Neutral', 'No Response'],
      required: true
    },
    tone: {
      type: String,
      enum: ['Energizing', 'Neutral', 'Draining'],
      required: true
    },
    reflection: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IInteraction>('Interaction', InteractionSchema);
