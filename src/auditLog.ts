/**
 * auditLog.ts
 * Lightweight helper that the rest of the app calls to record key events.
 * No permissions, no async — just append to localStorage.
 */
import { AuditEvent, AuditEventType, Relationship, Interaction } from './types';
import { appendAuditEvent } from './storage';
import { generateId } from './utils';

function base(
  type: AuditEventType,
  rel: Pick<Relationship, 'id' | 'name' | 'organization'>,
  extra?: Partial<AuditEvent>,
): AuditEvent {
  return {
    id: generateId(),
    type,
    relationshipId: rel.id,
    relationshipName: rel.name,
    organization: rel.organization,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

export function logLeadCreated(rel: Relationship): void {
  appendAuditEvent(base(AuditEventType.LeadCreated, rel, {
    detail: `Lead created — ${rel.stage}${rel.dealValue ? ` · $${rel.dealValue.toLocaleString('en-US')}` : ''}`,
    newValue: rel.stage,
  }));
}

export function logLeadEdited(rel: Relationship, changed: string[]): void {
  if (!changed.length) return;
  appendAuditEvent(base(AuditEventType.LeadEdited, rel, {
    detail: `Updated: ${changed.join(', ')}`,
  }));
}

export function logStageChanged(rel: Relationship, from: string, to: string): void {
  const type =
    to === 'Closed Won'  ? AuditEventType.LeadClosedWon  :
    to === 'Closed Lost' ? AuditEventType.LeadClosedLost :
    AuditEventType.StageChanged;

  appendAuditEvent(base(type, rel, {
    detail: `Stage: ${from} → ${to}`,
    oldValue: from,
    newValue: to,
  }));
}

export function logFollowUpChanged(rel: Relationship, oldDate: string | undefined, newDate: string | undefined): void {
  const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'none';
  appendAuditEvent(base(AuditEventType.FollowUpChanged, rel, {
    detail: `Follow-up date: ${fmt(oldDate)} → ${fmt(newDate)}`,
    oldValue: oldDate,
    newValue: newDate,
  }));
}

export function logNextActionChanged(rel: Relationship, oldAction: string | undefined, newAction: string | undefined): void {
  appendAuditEvent(base(AuditEventType.NextActionChanged, rel, {
    detail: `Next action updated`,
    oldValue: oldAction,
    newValue: newAction,
  }));
}

export function logActivityLogged(rel: Pick<Relationship, 'id' | 'name' | 'organization'>, interaction: Interaction): void {
  const label = interaction.subject
    ? `${interaction.type}: "${interaction.subject}"`
    : interaction.type;
  appendAuditEvent(base(AuditEventType.ActivityLogged, rel, {
    detail: `Activity logged — ${label} · ${interaction.outcome}`,
    interactionType: interaction.type,
    newValue: interaction.outcome,
  }));
}
