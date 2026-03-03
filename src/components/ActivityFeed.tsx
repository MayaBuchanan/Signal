import { useState, useMemo } from 'react';
import { AuditEvent, AuditEventType } from '../types';
import { getAuditLog } from '../storage';
import './ActivityFeed.css';

interface ActivityFeedProps {
  onSelectRelationship: (id: string) => void;
}

// ── Per-type display config ─────────────────────────────────────────────────
const EVENT_META: Record<AuditEventType, { icon: string; label: string; colorClass: string }> = {
  [AuditEventType.LeadCreated]:       { icon: '🆕', label: 'Lead Created',       colorClass: 'ev-created' },
  [AuditEventType.LeadEdited]:        { icon: '✏️',  label: 'Lead Edited',        colorClass: 'ev-edited' },
  [AuditEventType.StageChanged]:      { icon: '🔄', label: 'Stage Changed',       colorClass: 'ev-stage' },
  [AuditEventType.FollowUpChanged]:   { icon: '🗓', label: 'Follow-up Changed',   colorClass: 'ev-followup' },
  [AuditEventType.NextActionChanged]: { icon: '📝', label: 'Next Action Changed', colorClass: 'ev-nextaction' },
  [AuditEventType.ActivityLogged]:    { icon: '💬', label: 'Activity Logged',     colorClass: 'ev-activity' },
  [AuditEventType.LeadClosedWon]:     { icon: '🏆', label: 'Closed Won',          colorClass: 'ev-won' },
  [AuditEventType.LeadClosedLost]:    { icon: '❌', label: 'Closed Lost',         colorClass: 'ev-lost' },
};

// ── Relative timestamp ──────────────────────────────────────────────────────
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)   return 'just now';
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const TYPE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all',                             label: 'All Events' },
  { value: AuditEventType.LeadCreated,        label: '🆕 Lead Created' },
  { value: AuditEventType.LeadEdited,         label: '✏️ Lead Edited' },
  { value: AuditEventType.StageChanged,       label: '🔄 Stage Changed' },
  { value: AuditEventType.FollowUpChanged,    label: '🗓 Follow-up Changed' },
  { value: AuditEventType.NextActionChanged,  label: '📝 Next Action Changed' },
  { value: AuditEventType.ActivityLogged,     label: '💬 Activity Logged' },
  { value: AuditEventType.LeadClosedWon,      label: '🏆 Closed Won' },
  { value: AuditEventType.LeadClosedLost,     label: '❌ Closed Lost' },
];

export default function ActivityFeed({ onSelectRelationship }: ActivityFeedProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [leadSearch, setLeadSearch] = useState('');

  // Read fresh from storage; re-mounted on every tab switch so no stale data
  const allEvents: AuditEvent[] = useMemo(
    () =>
      getAuditLog()
        .slice()
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, 200),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const filtered = useMemo(() => {
    const q = leadSearch.trim().toLowerCase();
    return allEvents
      .filter(e => typeFilter === 'all' || e.type === typeFilter)
      .filter(
        e =>
          q === '' ||
          e.relationshipName.toLowerCase().includes(q) ||
          e.organization.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [allEvents, typeFilter, leadSearch]);

  const uniqueLeads = useMemo(
    () => new Set(allEvents.map(e => e.relationshipId)).size,
    [allEvents]
  );

  return (
    <div className="activity-feed">
      {/* ── Header ── */}
      <div className="af-header">
        <h2>📋 Activity Feed</h2>
        <span className="af-meta">{allEvents.length} events · {uniqueLeads} leads</span>
      </div>

      {/* ── Filters ── */}
      <div className="af-filters">
        <select
          className="af-filter-select"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          {TYPE_FILTER_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <div className="af-search-wrap">
          <span className="af-search-icon">🔍</span>
          <input
            className="af-search-input"
            type="text"
            placeholder="Filter by lead or company…"
            value={leadSearch}
            onChange={e => setLeadSearch(e.target.value)}
          />
          {leadSearch && (
            <button className="af-search-clear" onClick={() => setLeadSearch('')} aria-label="Clear">
              ✕
            </button>
          )}
        </div>

        <span className="af-result-count">
          {filtered.length === 50 ? 'Top 50' : filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Feed list ── */}
      {filtered.length === 0 ? (
        <div className="af-empty">
          <div className="af-empty-icon">{allEvents.length === 0 ? '📭' : '🔍'}</div>
          <h3>
            {allEvents.length === 0
              ? 'No activity recorded yet'
              : 'No events match your filters'}
          </h3>
          <p>
            {allEvents.length === 0
              ? 'Load demo data from the Contacts tab, then add or edit leads to start building your audit trail.'
              : 'Try a different event type or clear the lead search.'}
          </p>
        </div>
      ) : (
        <div className="af-list">
          {filtered.map(event => {
            const meta = EVENT_META[event.type];
            return (
              <div key={event.id} className={`af-row ${meta.colorClass}`}>
                <div className="af-row-icon" title={meta.label}>
                  {meta.icon}
                </div>

                <div className="af-row-body">
                  <div className="af-row-top">
                    <button
                      className="af-lead-link"
                      onClick={() => onSelectRelationship(event.relationshipId)}
                      title="Open lead detail"
                    >
                      {event.relationshipName}
                    </button>
                    <span className="af-org">· {event.organization}</span>
                    <span className={`af-type-chip ${meta.colorClass}`}>{meta.label}</span>
                  </div>

                  {event.detail && <p className="af-row-detail">{event.detail}</p>}
                </div>

                <time
                  className="af-row-time"
                  dateTime={event.timestamp}
                  title={new Date(event.timestamp).toLocaleString()}
                >
                  {relativeTime(event.timestamp)}
                </time>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
