import { useState } from 'react';
import { Relationship, Stage, LeadSource } from '../types';

interface AddEditRelationshipModalProps {
  relationship?: Relationship;
  onClose: () => void;
  onSave: (relationship: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

// BDR pipeline stages first; legacy values kept so existing records still display
const PIPELINE_STAGES = [
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

function AddEditRelationshipModal({ relationship, onClose, onSave }: AddEditRelationshipModalProps) {
  const [formData, setFormData] = useState({
    name: relationship?.name || '',
    organization: relationship?.organization || '',
    title: relationship?.title || '',
    industry: relationship?.industry || '',
    region: relationship?.region || '',
    stage: relationship?.stage || Stage.Prospect,
    leadSource: relationship?.leadSource || LeadSource.Outbound,
    leadScore: relationship?.leadScore ?? ('' as number | ''),
    dealValue: relationship?.dealValue ?? ('' as number | ''),
    closeDate: relationship?.closeDate ? relationship.closeDate.split('T')[0] : '',
    nextFollowUpDate: relationship?.nextFollowUpDate
      ? relationship.nextFollowUpDate.split('T')[0]
      : '',
    nextAction: relationship?.nextAction || '',
    owner: relationship?.owner || '',
    notes: relationship?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      leadScore: formData.leadScore !== '' ? Number(formData.leadScore) : undefined,
      dealValue: formData.dealValue !== '' ? Number(formData.dealValue) : undefined,
      closeDate: formData.closeDate
        ? new Date(formData.closeDate).toISOString()
        : undefined,
      nextFollowUpDate: formData.nextFollowUpDate
        ? new Date(formData.nextFollowUpDate).toISOString()
        : undefined,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {relationship ? 'Edit Contact' : 'Add Contact'}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" name="title" className="form-input" placeholder="e.g. VP of Sales" value={formData.title} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Organization *</label>
                <input type="text" name="organization" className="form-input" value={formData.organization} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <input type="text" name="industry" className="form-input" value={formData.industry} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Region</label>
                <input type="text" name="region" className="form-input" value={formData.region} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Owner</label>
                <input type="text" name="owner" className="form-input" value={formData.owner} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section-divider">Pipeline</div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Stage *</label>
                <select name="stage" className="form-select" value={formData.stage} onChange={handleChange} required>
                  {PIPELINE_STAGES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Lead Source</label>
                <select name="leadSource" className="form-select" value={formData.leadSource} onChange={handleChange}>
                  {Object.values(LeadSource).map(ls => (
                    <option key={ls} value={ls}>{ls}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Lead Score (1–5)</label>
                <input type="number" name="leadScore" className="form-input" min={1} max={5} placeholder="—" value={formData.leadScore} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Deal Value ($)</label>
                <input type="number" name="dealValue" className="form-input" min={0} placeholder="e.g. 24000" value={formData.dealValue} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Est. Close Date</label>
                <input type="date" name="closeDate" className="form-input" value={formData.closeDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Next Follow-up</label>
                <input type="date" name="nextFollowUpDate" className="form-input" value={formData.nextFollowUpDate} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Next Action</label>
              <input type="text" name="nextAction" className="form-input" placeholder="e.g. Send pricing deck after demo" value={formData.nextAction} onChange={handleChange} />
            </div>

            <div className="form-section-divider">Notes</div>
            <div className="form-group">
              <textarea name="notes" className="form-textarea" value={formData.notes} onChange={handleChange} rows={3} placeholder="ICP fit rationale, pain points, key context..." />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {relationship ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditRelationshipModal;
