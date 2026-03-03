import { useState, useEffect, useMemo } from 'react';
import { Relationship, Stage, LeadSource, Interaction } from '../types';
import { getRelationships, getInteractions, saveInteractions } from '../storage';
import { formatCurrency, followUpLabel, lastTouchedLabel, stageProbability, generateId } from '../utils';
import { logActivityLogged } from '../auditLog';
import { exportPipelineCSV, exportActivityCSV } from '../exports';
import AddEditInteractionModal from './AddEditInteractionModal';
import './PipelineBoard.css';

// The six canonical pipeline columns in funnel order
const PIPELINE_COLUMNS: { stage: Stage; emoji: string }[] = [
  { stage: Stage.Prospect,       emoji: '🔍' },
  { stage: Stage.Qualified,      emoji: '✅' },
  { stage: Stage.DemoScheduled,  emoji: '📅' },
  { stage: Stage.ProposalSent,   emoji: '📄' },
  { stage: Stage.ClosedWon,      emoji: '🏆' },
  { stage: Stage.ClosedLost,     emoji: '❌' },
];

interface PipelineBoardProps {
  onSelectRelationship: (id: string) => void;
  globalSearch?: string;
}

// ── Filter state ─────────────────────────────────────────────────────────────
interface Filters {
  owner: string;
  leadSource: string;
  minScore: number;
  overdueOnly: boolean;
}

const DEFAULT_FILTERS: Filters = {
  owner: '',
  leadSource: '',
  minScore: 0,
  overdueOnly: false,
};

// ── Small helpers ─────────────────────────────────────────────────────────────
function LeadScoreDots({ score }: { score?: number }) {
  if (!score) return <span className="pb-score-empty">—</span>;
  return (
    <span className="pb-score" title={`Lead score ${score}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < score ? 'dot filled' : 'dot'} />
      ))}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PipelineBoard({ onSelectRelationship, globalSearch = '' }: PipelineBoardProps) {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [lastTouchedMap, setLastTouchedMap] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [queueOpen, setQueueOpen] = useState(true);
  // null = closed, string = relationshipId to log against
  const [logActivityFor, setLogActivityFor] = useState<string | null>(null);

  const loadAll = () => {
    const rels = getRelationships();
    setRelationships(rels);
    const interactions = getInteractions();
    const touched: Record<string, string> = {};
    for (const i of interactions) {
      const prev = touched[i.relationshipId];
      if (!prev || i.date > prev) touched[i.relationshipId] = i.date;
    }
    setLastTouchedMap(touched);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Save a new interaction from the Follow-up Queue quick-log
  const handleLogActivity = (
    relationshipId: string,
    data: Omit<Interaction, 'id' | 'relationshipId'>
  ) => {
    const newInteraction: Interaction = {
      id: generateId(),
      relationshipId,
      ...data,
    };
    const all = getInteractions();
    saveInteractions([...all, newInteraction]);

    // Audit log
    const rel = relationships.find(r => r.id === relationshipId);
    if (rel) {
      logActivityLogged({ id: rel.id, name: rel.name, organization: rel.organization }, newInteraction);
    }

    setLogActivityFor(null);
    loadAll(); // refresh touched map
  };

  // ── Derived filter options ────────────────────────────────────────────────
  const owners = useMemo(
    () => Array.from(new Set(relationships.map(r => r.owner).filter(Boolean))).sort(),
    [relationships]
  );
  const sources = useMemo(
    () => Object.values(LeadSource),
    []
  );

  // ── Follow-up queue: overdue + due today, sorted most-overdue first ────────
  const followUpQueue = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return relationships
      .filter(r => {
        if (!r.nextFollowUpDate) return false;
        const due = new Date(r.nextFollowUpDate);
        due.setHours(0, 0, 0, 0);
        return due <= today;
      })
      .sort((a, b) => {
        const aDate = new Date(a.nextFollowUpDate!).getTime();
        const bDate = new Date(b.nextFollowUpDate!).getTime();
        return aDate - bDate; // most overdue (oldest) first
      });
  }, [relationships]);

  // ── Apply filters + sort ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = globalSearch.trim().toLowerCase();

    return relationships
      .filter(r => {
        if (filters.owner && r.owner !== filters.owner) return false;
        if (filters.leadSource && r.leadSource !== filters.leadSource) return false;
        if (filters.minScore && (r.leadScore ?? 0) < filters.minScore) return false;
        if (filters.overdueOnly) {
          if (!r.nextFollowUpDate) return false;
          const due = new Date(r.nextFollowUpDate);
          due.setHours(0, 0, 0, 0);
          if (due >= today) return false;
        }
        if (q) {
          const haystack = [r.name, r.organization, r.title ?? '', r.industry, r.owner]
            .join(' ').toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      // Sort: leadScore desc, then nextFollowUpDate asc (nulls last)
      .sort((a, b) => {
        const scoreDiff = (b.leadScore ?? 0) - (a.leadScore ?? 0);
        if (scoreDiff !== 0) return scoreDiff;
        const aDate = a.nextFollowUpDate ? new Date(a.nextFollowUpDate).getTime() : Infinity;
        const bDate = b.nextFollowUpDate ? new Date(b.nextFollowUpDate).getTime() : Infinity;
        return aDate - bDate;
      });
  }, [relationships, filters, globalSearch]);

  const activeFiltersCount = [
    filters.owner,
    filters.leadSource,
    filters.minScore > 0,
    filters.overdueOnly,
    globalSearch.trim() !== '',
  ].filter(Boolean).length;

  return (
    <div className="pipeline-board">
      {/* ── Log Activity Modal (from follow-up queue) ── */}
      {logActivityFor && (
        <AddEditInteractionModal
          onClose={() => setLogActivityFor(null)}
          onSave={(data) => handleLogActivity(logActivityFor, data)}
        />
      )}

      {/* ── Header ── */}
      <div className="pb-header">
        <div className="pb-header-left">
          <h2>Pipeline</h2>
          <span className="pb-total-count">{filtered.length} contacts</span>
        </div>
        {relationships.length > 0 && (
          <div className="pb-header-actions">
            <button className="btn btn-secondary btn-sm" onClick={exportPipelineCSV} title="Download pipeline as CSV">
              📥 Pipeline CSV
            </button>
            <button className="btn btn-secondary btn-sm" onClick={exportActivityCSV} title="Download all activity as CSV">
              📥 Activity CSV
            </button>
          </div>
        )}
      </div>

      {/* ── Follow-up Queue ── */}
      {followUpQueue.length > 0 && (
        <div className="pb-queue">
          <button
            className="pb-queue-toggle"
            onClick={() => setQueueOpen(o => !o)}
            aria-expanded={queueOpen}
          >
            <span className="pb-queue-badge">{followUpQueue.length}</span>
            <span className="pb-queue-title">⏰ Follow-up Queue</span>
            <span className="pb-queue-sub">
              {followUpQueue.length} contact{followUpQueue.length !== 1 ? 's' : ''} need attention
            </span>
            <span className="pb-queue-chevron">{queueOpen ? '▲' : '▼'}</span>
          </button>

          {queueOpen && (
            <div className="pb-queue-list">
              {followUpQueue.map(r => {
                const fl = followUpLabel(r.nextFollowUpDate)!;
                return (
                  <div key={r.id} className="pb-queue-row">
                    <div className="pb-queue-row-left" onClick={() => onSelectRelationship(r.id)}>
                      <span className="pb-queue-name">{r.name}</span>
                      {r.title && <span className="pb-queue-title-text">{r.title}</span>}
                      <span className="pb-queue-org">{r.organization}</span>
                    </div>
                    <div className="pb-queue-row-mid">
                      <span className={`pb-queue-due ${fl.overdue ? 'overdue' : 'today'}`}>
                        {fl.overdue ? `⚠️ Overdue ${Math.abs(parseInt(fl.text))}d` : '📅 Due today'}
                      </span>
                      {r.nextAction && (
                        <span className="pb-queue-action">→ {r.nextAction}</span>
                      )}
                    </div>
                    <div className="pb-queue-row-right">
                      <span className={`stage-badge stage-${r.stage.toLowerCase().replace(/\s+/g, '-')}`}>
                        {r.stage}
                      </span>
                      <button
                        className="btn btn-primary btn-sm pb-queue-log-btn"
                        onClick={() => setLogActivityFor(r.id)}
                      >
                        + Log Activity
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Filter bar ── */}
      <div className="pb-filters">
        <select
          className="pb-filter-select"
          value={filters.owner}
          onChange={e => setFilters(f => ({ ...f, owner: e.target.value }))}
        >
          <option value="">All Owners</option>
          {owners.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        <select
          className="pb-filter-select"
          value={filters.leadSource}
          onChange={e => setFilters(f => ({ ...f, leadSource: e.target.value }))}
        >
          <option value="">All Sources</option>
          {sources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          className="pb-filter-select"
          value={filters.minScore}
          onChange={e => setFilters(f => ({ ...f, minScore: Number(e.target.value) }))}
        >
          <option value={0}>Any Score</option>
          <option value={3}>Score ≥ 3★</option>
          <option value={4}>Score ≥ 4★</option>
          <option value={5}>Score = 5★</option>
        </select>

        <label className="pb-filter-toggle">
          <input
            type="checkbox"
            checked={filters.overdueOnly}
            onChange={e => setFilters(f => ({ ...f, overdueOnly: e.target.checked }))}
          />
          <span>Overdue only</span>
        </label>

        {activeFiltersCount > 0 && (
          <button
            className="pb-clear-btn"
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            Clear {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* ── Kanban columns ── */}
      {relationships.length === 0 ? (
        <div className="pb-empty-board">
          <div className="pb-empty-icon">📋</div>
          <h3>Your pipeline is empty</h3>
          <p>Load the demo data from the Contacts tab to see a fully populated pipeline, or add your first contact to get started.</p>
          <div className="pb-empty-actions">
            <button className="btn btn-secondary" onClick={() => {}}>
              Switch to Contacts →
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="pb-empty-board">
          <div className="pb-empty-icon">🔍</div>
          <h3>No contacts match</h3>
          <p>Try clearing your search or filters.</p>
        </div>
      ) : (
      <div className="pb-columns-scroll">
        <div className="pb-columns">
          {PIPELINE_COLUMNS.map(({ stage, emoji }) => {
            const cards = filtered.filter(r => r.stage === stage);
            const totalValue = cards.reduce((sum, r) => sum + (r.dealValue ?? 0), 0);
            const prob = stageProbability[stage] ?? 0;

            return (
              <div key={stage} className={`pb-column pb-col-${stage.toLowerCase().replace(/\s+/g, '-')}`}>
                {/* Column header */}
                <div className="pb-col-header">
                  <div className="pb-col-title">
                    <span className="pb-col-emoji">{emoji}</span>
                    <span className="pb-col-name">{stage}</span>
                    <span className="pb-col-count">{cards.length}</span>
                  </div>
                  <div className="pb-col-meta">
                    {totalValue > 0 && (
                      <span className="pb-col-value">{formatCurrency(totalValue)}</span>
                    )}
                    <span className="pb-col-prob">{prob}%</span>
                  </div>
                </div>

                {/* Cards */}
                <div className="pb-cards">
                  {cards.length === 0 ? (
                    <div className="pb-empty-col">No contacts</div>
                  ) : (
                    cards.map(r => (
                      <PipelineCard
                        key={r.id}
                        relationship={r}
                        lastTouched={lastTouchedMap[r.id]}
                        onClick={() => onSelectRelationship(r.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
}

// ── Pipeline Card ─────────────────────────────────────────────────────────────
interface PipelineCardProps {
  relationship: Relationship;
  lastTouched?: string;
  onClick: () => void;
}

function PipelineCard({ relationship: r, lastTouched, onClick }: PipelineCardProps) {
  const followUp = followUpLabel(r.nextFollowUpDate);
  const touched  = lastTouchedLabel(lastTouched);
  const prob     = stageProbability[r.stage] ?? 0;

  return (
    <div
      className={`pb-card ${followUp?.overdue ? 'pb-card-overdue' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {/* Name + company */}
      <div className="pb-card-top">
        <div className="pb-card-identity">
          <span className="pb-card-name">{r.name}</span>
          {r.title && <span className="pb-card-title">{r.title}</span>}
          <span className="pb-card-org">{r.organization}</span>
        </div>
        <LeadScoreDots score={r.leadScore} />
      </div>

      {/* Deal value + probability */}
      <div className="pb-card-financials">
        <span className="pb-card-value">{formatCurrency(r.dealValue)}</span>
        {prob > 0 && prob < 100 && (
          <span className="pb-card-prob">{prob}% likely</span>
        )}
        {r.leadSource && (
          <span className={`pb-source source-${r.leadSource.toLowerCase()}`}>{r.leadSource}</span>
        )}
      </div>

      {/* Follow-up + last touched */}
      <div className="pb-card-footer">
        {followUp ? (
          <span className={`pb-followup ${followUp.overdue ? 'overdue' : 'upcoming'}`}>
            {followUp.overdue ? '⚠️ ' : '🗓 '}{followUp.text}
          </span>
        ) : (
          <span className="pb-followup none">No follow-up set</span>
        )}
        <span className="pb-last-touched" title={lastTouched ? `Last activity: ${lastTouched}` : 'No activity logged'}>
          {touched === 'Never' ? '💤 Never touched' : `📌 ${touched}`}
        </span>
      </div>
    </div>
  );
}
