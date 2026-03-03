// ── Pipeline stages (replaces old Stage enum; old values migrate via storage.ts) ──
export enum Stage {
  // Legacy values kept so existing records still display correctly
  Exploring = 'Exploring',
  Active = 'Active',
  AtRisk = 'At Risk',
  Completed = 'Completed',
  // New BDR pipeline stages
  Prospect = 'Prospect',
  Qualified = 'Qualified',
  DemoScheduled = 'Demo Scheduled',
  ProposalSent = 'Proposal Sent',
  ClosedWon = 'Closed Won',
  ClosedLost = 'Closed Lost',
}

// ── Lead source ──
export enum LeadSource {
  Outbound = 'Outbound',
  Inbound = 'Inbound',
  Referral = 'Referral',
  Event = 'Event',
  Other = 'Other',
}

export enum InteractionType {
  // Legacy
  Call = 'Call',
  Email = 'Email',
  Meeting = 'Meeting',
  // New BDR activity types
  ColdEmail = 'Cold Email',
  FollowUpEmail = 'Follow-up Email',
  LinkedInMessage = 'LinkedIn Message',
  ColdCall = 'Cold Call',
  Voicemail = 'Voicemail',
  DiscoveryCall = 'Discovery Call',
  Demo = 'Demo',
  ProposalReview = 'Proposal Review',
}

export enum Outcome {
  Positive = 'Positive',
  Neutral = 'Neutral',
  NoResponse = 'No Response',
  // New
  Booked = 'Booked',
  NotInterested = 'Not Interested',
}

export enum Tone {
  Energizing = 'Energizing',
  Neutral = 'Neutral',
  Draining = 'Draining',
}

export enum Direction {
  Outbound = 'Outbound',
  Inbound = 'Inbound',
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
  // ── New BDR fields (all optional for backward compat) ──
  title?: string;              // e.g. "VP of Sales", "Head of Ops"
  leadSource?: LeadSource;
  leadScore?: number;          // 1–5
  dealValue?: number;          // ARR in dollars
  closeDate?: string;          // ISO date string
  nextFollowUpDate?: string;   // ISO date string
  nextAction?: string;         // Free-text e.g. "Send pricing deck"
}

export interface Interaction {
  id: string;
  relationshipId: string;
  type: InteractionType;
  date: string;
  outcome: Outcome;
  tone: Tone;
  reflection: string;
  // ── New BDR fields (all optional for backward compat) ──
  subject?: string;            // Email subject / call topic
  direction?: Direction;
}

// ── Audit log ──
export enum AuditEventType {
  LeadCreated      = 'lead_created',
  LeadEdited       = 'lead_edited',
  StageChanged     = 'stage_changed',
  FollowUpChanged  = 'followup_changed',
  NextActionChanged= 'next_action_changed',
  ActivityLogged   = 'activity_logged',
  LeadClosedWon    = 'lead_closed_won',
  LeadClosedLost   = 'lead_closed_lost',
}

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  relationshipId: string;
  relationshipName: string;   // denormalised so Feed works without joining
  organization: string;       // denormalised
  timestamp: string;          // ISO
  // Optional payload fields (only the relevant ones are set per event type)
  detail?: string;            // human-readable summary line
  oldValue?: string;
  newValue?: string;
  interactionType?: string;   // for ActivityLogged events
}

export interface AppData {
  relationships: Relationship[];
  interactions: Interaction[];
  auditLog: AuditEvent[];
  version: number;
  schemaVersion: number;       // separate from data version
}
