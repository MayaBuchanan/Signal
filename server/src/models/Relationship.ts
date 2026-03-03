import mongoose, { Schema, Document } from 'mongoose';

export interface IRelationship extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  organization: string;
  industry: string;
  region: string;
  stage: string; // widened — accepts both legacy and new pipeline stages
  owner: string;
  notes: string;
  // New BDR fields (all optional)
  title?: string;
  leadSource?: string;
  leadScore?: number;
  dealValue?: number;
  closeDate?: Date;
  nextFollowUpDate?: Date;
  nextAction?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RelationshipSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    organization: {
      type: String,
      required: true,
      trim: true
    },
    industry: {
      type: String,
      default: ''
    },
    region: {
      type: String,
      default: ''
    },
    stage: {
      type: String,
      default: 'Prospect'
    },
    owner: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    // New BDR fields — all optional so existing documents are unaffected
    title: { type: String, default: '' },
    leadSource: { type: String, default: '' },
    leadScore: { type: Number, min: 1, max: 5 },
    dealValue: { type: Number, min: 0 },
    closeDate: { type: Date },
    nextFollowUpDate: { type: Date },
    nextAction: { type: String, default: '' },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IRelationship>('Relationship', RelationshipSchema);
