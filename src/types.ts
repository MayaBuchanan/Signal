export enum Stage {
  Exploring = 'Exploring',
  Active = 'Active',
  AtRisk = 'At Risk',
  Completed = 'Completed'
}

export enum InteractionType {
  Call = 'Call',
  Email = 'Email',
  Meeting = 'Meeting'
}

export enum Outcome {
  Positive = 'Positive',
  Neutral = 'Neutral',
  NoResponse = 'No Response'
}

export enum Tone {
  Energizing = 'Energizing',
  Neutral = 'Neutral',
  Draining = 'Draining'
}

export interface Relationship {
  id: string;
  name: string;
  organization: string;
  industry: string;
  region: string;
  stage: Stage;
  owner: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export interface Interaction {
  id: string;
  relationshipId: string;
  type: InteractionType;
  date: string;
  outcome: Outcome;
  tone: Tone;
  reflection: string;
}

export interface AppData {
  relationships: Relationship[];
  interactions: Interaction[];
  version: number;
}
