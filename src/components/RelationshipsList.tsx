import { useState, useEffect } from 'react';
import { Relationship, Stage } from '../types';
import { getRelationships } from '../storage';
import { apiClient } from '../api/client';
import { syncService } from '../services/sync';
import { loadSeedData } from '../data/seedData';
import { formatCurrency, followUpLabel, relativeDateLabel } from '../utils';
import { logLeadCreated, logLeadEdited, logStageChanged, logFollowUpChanged } from '../auditLog';
import { exportPipelineCSV, exportActivityCSV } from '../exports';
import AddEditRelationshipModal from './AddEditRelationshipModal';
import './RelationshipsList.css';

// Determine which fields changed between old and new relationship data
function changedFields(
  old: Relationship,
  next: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>
): string[] {
  const fields: string[] = [];
  if (old.name !== next.name)               fields.push('name');
  if (old.organization !== next.organization) fields.push('organization');
  if (old.title !== next.title)             fields.push('title');
  if (old.industry !== next.industry)       fields.push('industry');
  if (old.region !== next.region)           fields.push('region');
  if (old.owner !== next.owner)             fields.push('owner');
  if (old.dealValue !== next.dealValue)     fields.push('deal value');
  if (old.leadSource !== next.leadSource)   fields.push('lead source');
  if (old.leadScore !== next.leadScore)     fields.push('lead score');
  if (old.closeDate !== next.closeDate)     fields.push('close date');
  if (old.nextAction !== next.nextAction)   fields.push('next action');
  if (old.notes !== next.notes)             fields.push('notes');
  return fields;
}

interface RelationshipsListProps {
  onSelectRelationship: (id: string) => void;
  globalSearch?: string;
}

// BDR pipeline stages in funnel order for the filter dropdown
const STAGE_FILTER_ORDER: (Stage | 'all')[] = [
  'all',
  Stage.Prospect,
  Stage.Qualified,
  Stage.DemoScheduled,
  Stage.ProposalSent,
  Stage.ClosedWon,
  Stage.ClosedLost,
  Stage.Exploring,
  Stage.Active,
  Stage.AtRisk,
  Stage.Completed,
];

const STAGE_LABELS: Record<string, string> = {
  all: 'All Stages',
  [Stage.Prospect]: 'Prospect',
  [Stage.Qualified]: 'Qualified',
  [Stage.DemoScheduled]: 'Demo Scheduled',
  [Stage.ProposalSent]: 'Proposal Sent',
  [Stage.ClosedWon]: '✅ Closed Won',
  [Stage.ClosedLost]: '❌ Closed Lost',
  [Stage.Exploring]: 'Exploring (legacy)',
  [Stage.Active]: 'Active (legacy)',
  [Stage.AtRisk]: 'At Risk (legacy)',
  [Stage.Completed]: 'Completed (legacy)',
};

function LeadScore({ score }: { score?: number }) {
  if (!score) return <span className="lead-score-empty">—</span>;
  return (
    <span className="lead-score" title={`Lead score: ${score}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < score ? 'star filled' : 'star'}>★</span>
      ))}
    </span>
  );
}

function RelationshipsList({ onSelectRelationship, globalSearch = '' }: RelationshipsListProps) {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<Stage | 'all'>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');
  const [seedLoaded, setSeedLoaded] = useState(false);

  useEffect(() => {
    loadRelationships();
    syncFromCloud();
    // Check if seed data is already present (any stable seed rel ID exists)
    const existing = getRelationships();
    if (existing.some(r => r.id === 'seed-rel-01')) setSeedLoaded(true);
  }, []);

  const loadRelationships = () => {
    const data = getRelationships();
    setRelationships(data);
  };

  const syncFromCloud = async () => {
    try {
      setIsSyncing(true);
      await syncService.syncFromCloud();
      loadRelationships();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLoadSeed = () => {
    const { added } = loadSeedData();
    if (added > 0) {
      setSeedMsg(`✅ Loaded ${added} demo contacts`);
      setSeedLoaded(true);
      setTimeout(() => setSeedMsg(''), 4000);
    } else {
      setSeedMsg('✅ Demo data already loaded');
      setSeedLoaded(true);
      setTimeout(() => setSeedMsg(''), 3000);
    }
    loadRelationships();
  };

  const handleAddRelationship = async (relationship: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // API returns the created doc; MongoDB uses _id
      const created = await apiClient.createRelationship(relationship);
      const newId: string | undefined = created?._id ?? created?.id;
      await syncService.syncFromCloud();
      loadRelationships();
      setShowModal(false);
      // Log after sync so the id is stable in the audit trail
      if (newId) {
        logLeadCreated({ ...relationship, id: newId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Relationship);
      }
    } catch (error) {
      console.error('Failed to add relationship:', error);
      alert('Failed to add contact. Please try again.');
    }
  };

  const handleEditRelationship = async (id: string, relationship: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Snapshot old values before saving
      const old = relationships.find(r => r.id === id);
      await apiClient.updateRelationship(id, relationship);

      if (old) {
        const updated = { ...relationship, id, createdAt: old.createdAt, updatedAt: old.updatedAt } as Relationship;

        // Stage changed?
        if (old.stage !== relationship.stage) {
          logStageChanged(updated, old.stage, relationship.stage);
        }

        // Follow-up date changed?
        if (old.nextFollowUpDate !== relationship.nextFollowUpDate) {
          logFollowUpChanged(updated, old.nextFollowUpDate, relationship.nextFollowUpDate);
        }

        // General field edits (excluding stage/followUp already logged above)
        const changed = changedFields(old, relationship).filter(
          f => f !== 'stage' && f !== 'next follow-up date'
        );
        if (changed.length) {
          logLeadEdited(updated, changed);
        }
      }

      await syncService.syncFromCloud();
      loadRelationships();
      setEditingRelationship(null);
    } catch (error) {
      console.error('Failed to update relationship:', error);
      alert('Failed to update contact. Please try again.');
    }
  };

  const handleDeleteRelationship = async (id: string) => {
    try {
      await apiClient.deleteRelationship(id);
      await syncService.syncFromCloud();
      loadRelationships();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete relationship:', error);
      alert('Failed to delete contact. Please try again.');
    }
  };

  const openEditModal = (relationship: Relationship) => {
    setEditingRelationship(relationship);
  };

  const filteredRelationships = relationships.filter(r => {
    // Merge local search box with the global header search (either can match)
    const q = (searchQuery || globalSearch).trim().toLowerCase();
    const matchesSearch =
      q === '' ||
      r.name.toLowerCase().includes(q) ||
      r.organization.toLowerCase().includes(q) ||
      (r.title ?? '').toLowerCase().includes(q) ||
      r.notes.toLowerCase().includes(q) ||
      (r.owner ?? '').toLowerCase().includes(q);
    const matchesStage = stageFilter === 'all' || r.stage === stageFilter;
    const matchesIndustry = industryFilter === 'all' || r.industry === industryFilter;
    return matchesSearch && matchesStage && matchesIndustry;
  });

  const industries = Array.from(new Set(relationships.map(r => r.industry))).filter(Boolean).sort();

  return (
    <div className="relationships-list">
      <div className="list-header">
        <h2>Contacts</h2>
        <div className="header-actions">
          {seedMsg && <span className="seed-msg">{seedMsg}</span>}
          <button
            className={`btn btn-ghost btn-sm ${seedLoaded ? 'seed-loaded' : ''}`}
            onClick={handleLoadSeed}
            title={seedLoaded ? 'Demo data is already loaded' : 'Load demo pipeline data'}
          >
            {seedLoaded ? '✅ Demo Loaded' : '🌱 Load Demo Data'}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={syncFromCloud}
            disabled={isSyncing}
          >
            {isSyncing ? '🔄 Syncing…' : '🔄 Sync'}
          </button>
          {relationships.length > 0 && (
            <>
              <button
                className="btn btn-secondary btn-sm"
                onClick={exportPipelineCSV}
                title="Download pipeline as CSV"
              >
                📥 Pipeline CSV
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={exportActivityCSV}
                title="Download all activity as CSV"
              >
                📥 Activity CSV
              </button>
            </>
          )}
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Contact
          </button>
        </div>
      </div>

      <div className="list-filters">
        <input
          type="text"
          placeholder="Search name, company, title, notes…"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Stage</label>
            <select
              className="filter-select"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as Stage | 'all')}
            >
              {STAGE_FILTER_ORDER.map(s => (
                <option key={s} value={s}>{STAGE_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Industry</label>
            <select
              className="filter-select"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="all">All Industries</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          <div className="filter-summary">
            {filteredRelationships.length} of {relationships.length} contacts
          </div>
        </div>
      </div>

      {filteredRelationships.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>{relationships.length === 0 ? 'No contacts yet' : 'No contacts match your filters'}</h3>
          <p>{relationships.length === 0
            ? 'Add a contact manually or load demo pipeline data to explore'
            : 'Try adjusting your search or filters'}
          </p>
          {relationships.length === 0 && (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Contact</button>
              <button className="btn btn-secondary" onClick={handleLoadSeed}>🌱 Load Demo Data</button>
            </div>
          )}
        </div>
      ) : (
        <div className="relationships-grid">
          {filteredRelationships.map(r => (
            <div key={r.id} className="relationship-card">
              <div className="card-header">
                <div className="card-title-block">
                  <h3 className="card-title" onClick={() => onSelectRelationship(r.id)}>
                    {r.name}
                  </h3>
                  <p className="card-subtitle">
                    {r.title ? `${r.title} · ` : ''}{r.organization}
                  </p>
                </div>
                <span className={`stage-badge stage-${r.stage.toLowerCase().replace(/\s+/g, '-')}`}>
                  {r.stage}
                </span>
              </div>

              <div className="card-meta-row">
                <LeadScore score={r.leadScore} />
                {r.dealValue != null && r.dealValue > 0 && (
                  <span className="deal-value">{formatCurrency(r.dealValue)}</span>
                )}
                {r.leadSource && (
                  <span className={`source-badge source-${r.leadSource.toLowerCase()}`}>{r.leadSource}</span>
                )}
              </div>

              <div className="card-details">
                {r.industry && (
                  <div className="card-detail-item">
                    <span className="detail-label">Industry</span>
                    <span className="detail-value">{r.industry}</span>
                  </div>
                )}
                {r.region && (
                  <div className="card-detail-item">
                    <span className="detail-label">Region</span>
                    <span className="detail-value">{r.region}</span>
                  </div>
                )}
                {r.nextFollowUpDate && (() => {
                  const fl = followUpLabel(r.nextFollowUpDate);
                  return fl ? (
                    <div className="card-detail-item">
                      <span className="detail-label">Follow-up</span>
                      <span className={`detail-value ${fl.overdue ? 'overdue' : ''}`}>
                        {fl.overdue ? '⚠️ ' : '🗓 '}{fl.text}
                      </span>
                    </div>
                  ) : null;
                })()}
                {r.closeDate && (() => {
                  const cl = relativeDateLabel(r.closeDate);
                  return cl ? (
                    <div className="card-detail-item">
                      <span className="detail-label">Close</span>
                      <span className={`detail-value ${cl.past ? 'overdue' : ''}`}>
                        {cl.text}
                      </span>
                    </div>
                  ) : null;
                })()}
              </div>

              {r.nextAction && (
                <p className="card-next-action">
                  <span className="next-action-label">Next:</span> {r.nextAction}
                </p>
              )}

              <div className="card-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => onSelectRelationship(r.id)}>
                  View
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(r)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(r.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddEditRelationshipModal onClose={() => setShowModal(false)} onSave={handleAddRelationship} />
      )}
      {editingRelationship && (
        <AddEditRelationshipModal
          relationship={editingRelationship}
          onClose={() => setEditingRelationship(null)}
          onSave={(data) => handleEditRelationship(editingRelationship.id, data)}
        />
      )}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this contact? This cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDeleteRelationship(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RelationshipsList;
