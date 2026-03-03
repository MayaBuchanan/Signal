// Metrics Dashboard — replaces the original SignalBoard
import { useState, useEffect, useMemo } from 'react';
import { Relationship, Interaction, Stage, Direction, Outcome, LeadSource } from '../types';
import { getRelationships, getInteractions } from '../storage';
import { formatCurrency, stageProbability } from '../utils';
import './SignalBoard.css';

// ── helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

function startOfMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function pct(num: number, denom: number): string {
  if (!denom) return '—';
  return Math.round((num / denom) * 100) + '%';
}

// ── Stat tile ─────────────────────────────────────────────────────────────────
interface StatProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
  large?: boolean;
}

function Stat({ label, value, sub, accent = 'blue', large }: StatProps) {
  return (
    <div className={`md-stat md-stat-${accent}`}>
      <div className={`md-stat-value ${large ? 'md-stat-value-lg' : ''}`}>{value}</div>
      <div className="md-stat-label">{label}</div>
      {sub && <div className="md-stat-sub">{sub}</div>}
    </div>
  );
}

// ── Funnel bar ────────────────────────────────────────────────────────────────
const FUNNEL_STAGES = [
  Stage.Prospect,
  Stage.Qualified,
  Stage.DemoScheduled,
  Stage.ProposalSent,
  Stage.ClosedWon,
];

function FunnelBar({ relationships }: { relationships: Relationship[] }) {
  const counts = FUNNEL_STAGES.map(s => ({
    stage: s,
    count: relationships.filter(r => r.stage === s).length,
    value: relationships.filter(r => r.stage === s).reduce((sum, r) => sum + (r.dealValue ?? 0), 0),
  }));
  const maxCount = Math.max(...counts.map(c => c.count), 1);

  return (
    <div className="md-funnel">
      {counts.map(({ stage, count, value }) => (
        <div key={stage} className="md-funnel-row">
          <div className="md-funnel-stage">{stage}</div>
          <div className="md-funnel-bar-wrap">
            <div
              className="md-funnel-bar-fill"
              style={{ width: `${(count / maxCount) * 100}%` }}
            />
          </div>
          <div className="md-funnel-count">{count}</div>
          <div className="md-funnel-value">{value > 0 ? formatCurrency(value) : '—'}</div>
        </div>
      ))}
    </div>
  );
}

// ── Activity sparkline (bar chart, last 14 days) ──────────────────────────────
function ActivityBars({ interactions }: { interactions: Interaction[] }) {
  const DAYS = 14;
  const bars = useMemo(() => {
    return Array.from({ length: DAYS }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (DAYS - 1 - i));
      const dateStr = d.toISOString().slice(0, 10);
      const count = interactions.filter(ix => ix.date.slice(0, 10) === dateStr).length;
      return { dateStr, count, label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    });
  }, [interactions]);

  const maxBar = Math.max(...bars.map(b => b.count), 1);

  return (
    <div className="md-sparkline">
      {bars.map(b => (
        <div
          key={b.dateStr}
          className="md-spark-col"
          title={`${b.label}: ${b.count} activit${b.count === 1 ? 'y' : 'ies'}`}
        >
          <div
            className="md-spark-bar"
            style={{ height: `${Math.max((b.count / maxBar) * 100, b.count > 0 ? 8 : 2)}%` }}
          />
          {b.count > 0 && <div className="md-spark-label">{b.count}</div>}
        </div>
      ))}
    </div>
  );
}

// ── Top contacts by lead score ────────────────────────────────────────────────
function TopContacts({ relationships }: { relationships: Relationship[] }) {
  const top = useMemo(() =>
    [...relationships]
      .filter(r => r.stage !== Stage.ClosedLost && r.stage !== Stage.ClosedWon)
      .sort((a, b) => (b.leadScore ?? 0) - (a.leadScore ?? 0))
      .slice(0, 6),
    [relationships]
  );

  if (!top.length) return <p className="md-empty">No active contacts.</p>;

  return (
    <div className="md-top-list">
      {top.map(r => (
        <div key={r.id} className="md-top-row">
          <div className="md-top-identity">
            <span className="md-top-name">{r.name}</span>
            <span className="md-top-org">{r.organization}</span>
          </div>
          <span className={`stage-badge stage-${r.stage.toLowerCase().replace(/\s+/g, '-')}`}>{r.stage}</span>
          <div className="md-top-score">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`md-dot ${i < (r.leadScore ?? 0) ? 'filled' : ''}`} />
            ))}
          </div>
          <span className="md-top-value">{formatCurrency(r.dealValue)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Lead source breakdown ─────────────────────────────────────────────────────
function SourceBreakdown({ relationships }: { relationships: Relationship[] }) {
  const total = relationships.length || 1;
  const counts = useMemo(() =>
    Object.values(LeadSource)
      .map(src => ({
        src,
        count: relationships.filter(r => r.leadSource === src).length,
      }))
      .filter(x => x.count > 0)
      .sort((a, b) => b.count - a.count),
    [relationships]
  );

  return (
    <div className="md-source-list">
      {counts.map(({ src, count }) => (
        <div key={src} className="md-source-row">
          <span className={`pb-source source-${src.toLowerCase()}`}>{src}</span>
          <div className="md-source-bar-wrap">
            <div className="md-source-bar-fill" style={{ width: `${(count / total) * 100}%` }} />
          </div>
          <span className="md-source-count">{count}</span>
          <span className="md-source-pct">{pct(count, total)}</span>
        </div>
      ))}
      {counts.length === 0 && <p className="md-empty">No source data yet.</p>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function MetricsDashboard() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [activityWindow, setActivityWindow] = useState<7 | 30>(30);

  useEffect(() => {
    setRelationships(getRelationships());
    setInteractions(getInteractions());
  }, []);

  // ── Time-windowed interactions ─────────────────────────────────────────────
  const recentInteractions = useMemo(
    () => interactions.filter(i => new Date(i.date) >= daysAgo(activityWindow)),
    [interactions, activityWindow]
  );

  // ── KPI calculations ───────────────────────────────────────────────────────
  const totalPipeline = useMemo(
    () => relationships
      .filter(r => r.stage !== Stage.ClosedLost && r.stage !== Stage.ClosedWon)
      .reduce((sum, r) => sum + (r.dealValue ?? 0), 0),
    [relationships]
  );

  const weightedPipeline = useMemo(
    () => relationships
      .filter(r => r.stage !== Stage.ClosedLost && r.stage !== Stage.ClosedWon)
      .reduce((sum, r) => sum + (r.dealValue ?? 0) * ((stageProbability[r.stage] ?? 0) / 100), 0),
    [relationships]
  );

  const closedWonThisMonth = useMemo(
    () => relationships
      .filter(r => r.stage === Stage.ClosedWon && r.closeDate && new Date(r.closeDate) >= startOfMonth())
      .reduce((sum, r) => sum + (r.dealValue ?? 0), 0),
    [relationships]
  );

  const closedWonCount = useMemo(
    () => relationships.filter(r =>
      r.stage === Stage.ClosedWon && r.closeDate && new Date(r.closeDate) >= startOfMonth()
    ).length,
    [relationships]
  );

  const totalOutbound = recentInteractions.filter(i => i.direction === Direction.Outbound).length;
  const totalInbound  = recentInteractions.filter(i => i.direction === Direction.Inbound).length;
  const positiveOutcomes = recentInteractions.filter(i =>
    i.outcome === Outcome.Positive || i.outcome === Outcome.Booked
  ).length;

  const overdueCount = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return relationships.filter(r => {
      if (!r.nextFollowUpDate) return false;
      const d = new Date(r.nextFollowUpDate); d.setHours(0, 0, 0, 0);
      return d < today;
    }).length;
  }, [relationships]);

  const avgLeadScore = useMemo(() => {
    const scored = relationships.filter(r => r.leadScore);
    if (!scored.length) return '—';
    return (scored.reduce((sum, r) => sum + (r.leadScore ?? 0), 0) / scored.length).toFixed(1);
  }, [relationships]);

  const month = new Date().toLocaleString('en-US', { month: 'short' });
  const hasData = relationships.length > 0;

  return (
    <div className="signal-board metrics-dashboard">
      {/* ── Header ── */}
      <div className="board-header">
        <h2>📈 Metrics Dashboard</h2>
        <p className="board-subtitle">BDR performance at a glance — pipeline health, activity &amp; conversion</p>
      </div>

      {!hasData ? (
        /* ── Empty state ── */
        <div className="md-empty-state">
          <div className="md-empty-icon">📊</div>
          <h3>No pipeline data yet</h3>
          <p>
            Load the demo dataset from the <strong>Contacts</strong> tab to see all metrics
            populated — pipeline value, funnel conversion, activity trends, and lead scoring.
          </p>
          <ul className="md-empty-checklist">
            <li>💰 Total &amp; weighted pipeline value</li>
            <li>🔽 Stage-by-stage funnel breakdown</li>
            <li>📅 14-day daily activity sparkline</li>
            <li>⭐ Top contacts ranked by lead score</li>
            <li>📌 Lead source mix chart</li>
          </ul>
          <p className="md-empty-hint">Switch to <strong>Contacts → 🌱 Load Demo Data</strong> to get started.</p>
        </div>
      ) : (
        <>
          {/* ── Activity window toggle ── */}
          <div className="md-window-toggle">
            <span className="md-window-label">Activity window:</span>
            <button
              className={`md-toggle-btn ${activityWindow === 7 ? 'active' : ''}`}
              onClick={() => setActivityWindow(7)}
            >Last 7 days</button>
            <button
              className={`md-toggle-btn ${activityWindow === 30 ? 'active' : ''}`}
              onClick={() => setActivityWindow(30)}
            >Last 30 days</button>
          </div>

          {/* ── Pipeline KPIs ── */}
          <div className="md-section-title">Pipeline</div>
          <div className="md-kpi-row">
            <Stat label="Total Open Pipeline"   value={formatCurrency(totalPipeline)}             accent="blue"   large sub="active opportunities" />
            <Stat label="Weighted Pipeline"      value={formatCurrency(Math.round(weightedPipeline))} accent="purple" sub="probability-adjusted" />
            <Stat label={`Closed Won (${month})`} value={formatCurrency(closedWonThisMonth)}       accent="green"  large sub={`${closedWonCount} deal${closedWonCount !== 1 ? 's' : ''} this month`} />
            <Stat label="Overdue Follow-ups"     value={overdueCount}                              accent={overdueCount > 0 ? 'red' : 'green'} sub="contacts needing action" />
            <Stat label="Avg Lead Score"         value={avgLeadScore}                              accent="orange" sub="1–5 scale" />
          </div>

          {/* ── Activity KPIs ── */}
          <div className="md-section-title">Activity — last {activityWindow} days</div>
          <div className="md-kpi-row">
            <Stat label="Total Activities"   value={recentInteractions.length}                     accent="blue" />
            <Stat label="Outbound Touches"   value={totalOutbound}                                 accent="purple" />
            <Stat label="Inbound Responses"  value={totalInbound}                                  accent="green" />
            <Stat label="Response Rate"      value={pct(positiveOutcomes, totalOutbound)}           accent="orange" sub="positive / outbound" />
            <Stat label="Outbound Ratio"     value={pct(totalOutbound, recentInteractions.length)} accent="blue"   sub="of all activity" />
          </div>

          {/* ── Charts row ── */}
          <div className="md-two-col">
            <div className="md-panel">
              <h3 className="md-panel-title">🔽 Pipeline Funnel</h3>
              <p className="md-panel-sub">Contact count + deal value by stage</p>
              <FunnelBar relationships={relationships} />
            </div>
            <div className="md-panel">
              <h3 className="md-panel-title">📅 Daily Activity (Last 14 Days)</h3>
              <p className="md-panel-sub">Total logged touches per day</p>
              <ActivityBars interactions={interactions} />
            </div>
          </div>

          {/* ── Tables row ── */}
          <div className="md-two-col">
            <div className="md-panel">
              <h3 className="md-panel-title">⭐ Top Contacts by Score</h3>
              <p className="md-panel-sub">Highest lead-scored open opportunities</p>
              <TopContacts relationships={relationships} />
            </div>
            <div className="md-panel">
              <h3 className="md-panel-title">📌 Lead Source Mix</h3>
              <p className="md-panel-sub">Where your pipeline comes from</p>
              <SourceBreakdown relationships={relationships} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MetricsDashboard;
