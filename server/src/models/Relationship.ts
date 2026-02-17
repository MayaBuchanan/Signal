import mongoose, { Schema, Document } from 'mongoose';

export interface IRelationship extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  organization: string;
  industry: string;
  region: string;
  stage: 'Exploring' | 'Active' | 'At Risk' | 'Completed';
  owner: string;
  notes: string;
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
      enum: ['Exploring', 'Active', 'At Risk', 'Completed'],
      default: 'Exploring'
    },
    owner: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IRelationship>('Relationship', RelationshipSchema);
