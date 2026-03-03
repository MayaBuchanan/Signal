import { AppData, Relationship, Interaction, LeadSource, Direction, AuditEvent } from './types';

const STORAGE_KEY = 'signal-app-data';
const CURRENT_VERSION = 1;
// Bump this when the shape of stored objects changes.
// Migration runs automatically on next load — existing data is never wiped.
const CURRENT_SCHEMA_VERSION = 3;

const defaultData: AppData = {
  relationships: [],
  interactions: [],
  auditLog: [],
  version: CURRENT_VERSION,
  schemaVersion: CURRENT_SCHEMA_VERSION,
};

// ── Migration helpers ────────────────────────────────────────────────────────

/**
 * v1 → v2: add new optional BDR fields to every existing record.
 * All additions use safe defaults so existing behaviour is unchanged.
 */
function migrateToV2(data: AppData): AppData {
  const relationships: Relationship[] = data.relationships.map(r => ({
    title: '',
    leadSource: LeadSource.Outbound,
    leadScore: undefined,
    dealValue: undefined,
    closeDate: undefined,
    nextFollowUpDate: undefined,
    nextAction: '',
    ...r, // existing fields win; only fills gaps
  }));

  const interactions: Interaction[] = data.interactions.map(i => ({
    subject: '',
    direction: Direction.Outbound,
    ...i, // existing fields win
  }));

  return { ...data, relationships, interactions, schemaVersion: 2 };
}

function runMigrations(data: AppData): AppData {
  const sv = data.schemaVersion ?? 1;
  let migrated = data;
  if (sv < 2) migrated = migrateToV2(migrated);
  if (sv < 3) migrated = migrateToV3(migrated);
  return migrated;
}

// v2 → v3: add auditLog array (empty — seed data provides the demo trail)
function migrateToV3(data: AppData): AppData {
  return {
    ...data,
    auditLog: (data as AppData & { auditLog?: AuditEvent[] }).auditLog ?? [],
    schemaVersion: 3,
  };
}

// ── Core storage functions ───────────────────────────────────────────────────

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { ...defaultData };
    }

    let parsed = JSON.parse(stored) as AppData;

    // Legacy: ensure schemaVersion exists before migrations
    if (!parsed.schemaVersion) parsed.schemaVersion = 1;

    // Run any pending migrations
    if (parsed.schemaVersion < CURRENT_SCHEMA_VERSION) {
      parsed = runMigrations(parsed);
      // Persist migrated data immediately so we don't re-migrate on next load
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      console.info(`[storage] Migrated schema to v${CURRENT_SCHEMA_VERSION}`);
    }

    return {
      relationships: parsed.relationships || [],
      interactions: parsed.interactions || [],
      auditLog: parsed.auditLog || [],
      version: parsed.version || CURRENT_VERSION,
      schemaVersion: parsed.schemaVersion || CURRENT_SCHEMA_VERSION,
    };
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return { ...defaultData };
  }
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    }));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const saveRelationships = (relationships: Relationship[]): void => {
  const data = loadData();
  data.relationships = relationships;
  data.version = CURRENT_VERSION;
  saveData(data);
};

export const saveInteractions = (interactions: Interaction[]): void => {
  const data = loadData();
  data.interactions = interactions;
  data.version = CURRENT_VERSION;
  saveData(data);
};

export const getRelationships = (): Relationship[] => {
  return loadData().relationships;
};

export const getInteractions = (): Interaction[] => {
  return loadData().interactions;
};

export const getInteractionsByRelationshipId = (relationshipId: string): Interaction[] => {
  return loadData().interactions.filter(i => i.relationshipId === relationshipId);
};

// ── Audit log helpers ────────────────────────────────────────────────────────

export const getAuditLog = (): AuditEvent[] => {
  return loadData().auditLog;
};

export const saveAuditLog = (auditLog: AuditEvent[]): void => {
  const data = loadData();
  data.auditLog = auditLog;
  saveData(data);
};

export const appendAuditEvent = (event: AuditEvent): void => {
  const data = loadData();
  // Keep at most 500 events; trim oldest first
  const trimmed = [...data.auditLog, event].slice(-500);
  data.auditLog = trimmed;
  saveData(data);
};
