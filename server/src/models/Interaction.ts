import mongoose, { Schema, Document } from 'mongoose';

export interface IInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  relationshipId: mongoose.Types.ObjectId;
  type: string; // widened — accepts all legacy + new activity types
  date: Date;
  outcome: string;
  tone: 'Energizing' | 'Neutral' | 'Draining';
  reflection: string;
  // New BDR fields (all optional)
  subject?: string;
  direction?: 'Outbound' | 'Inbound';
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
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    outcome: {
      type: String,
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
    },
    // New BDR fields — optional so existing documents are unaffected
    subject: { type: String, default: '' },
    direction: { type: String, enum: ['Outbound', 'Inbound'], default: 'Outbound' },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IInteraction>('Interaction', InteractionSchema);
