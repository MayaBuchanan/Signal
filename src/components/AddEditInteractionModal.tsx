import { useState } from 'react';
import { Interaction, InteractionType, Outcome, Tone, Direction } from '../types';

interface AddEditInteractionModalProps {
  interaction?: Interaction;
  onClose: () => void;
  onSave: (interaction: Omit<Interaction, 'id' | 'relationshipId'>) => void;
}

// Grouped for readability in the dropdown
const ACTIVITY_TYPES = [
  { label: '── Outbound ──', disabled: true, value: '' },
  { label: 'Cold Email',       disabled: false, value: InteractionType.ColdEmail },
  { label: 'Follow-up Email',  disabled: false, value: InteractionType.FollowUpEmail },
  { label: 'LinkedIn Message', disabled: false, value: InteractionType.LinkedInMessage },
  { label: 'Cold Call',        disabled: false, value: InteractionType.ColdCall },
  { label: 'Voicemail',        disabled: false, value: InteractionType.Voicemail },
  { label: '── Meetings ──',   disabled: true,  value: '' },
  { label: 'Discovery Call',   disabled: false, value: InteractionType.DiscoveryCall },
  { label: 'Demo',             disabled: false, value: InteractionType.Demo },
  { label: 'Proposal Review',  disabled: false, value: InteractionType.ProposalReview },
  { label: '── Legacy ──',     disabled: true,  value: '' },
  { label: 'Call',             disabled: false, value: InteractionType.Call },
  { label: 'Email',            disabled: false, value: InteractionType.Email },
  { label: 'Meeting',          disabled: false, value: InteractionType.Meeting },
];

function AddEditInteractionModal({ interaction, onClose, onSave }: AddEditInteractionModalProps) {
  const [formData, setFormData] = useState({
    type: interaction?.type || InteractionType.ColdEmail,
    subject: interaction?.subject || '',
    date: interaction?.date
      ? interaction.date.split('T')[0]
      : new Date().toISOString().split('T')[0],
    direction: interaction?.direction || Direction.Outbound,
    outcome: interaction?.outcome || Outcome.Neutral,
    tone: interaction?.tone || Tone.Neutral,
    reflection: interaction?.reflection || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      date: new Date(formData.date).toISOString(),
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
            {interaction ? 'Edit Activity' : 'Log Activity'}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Activity Type *</label>
                <select name="type" className="form-select" value={formData.type} onChange={handleChange} required>
                  {ACTIVITY_TYPES.map((opt, i) =>
                    opt.disabled
                      ? <option key={i} disabled value="">{opt.label}</option>
                      : <option key={opt.value} value={opt.value}>{opt.label}</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Direction</label>
                <select name="direction" className="form-select" value={formData.direction} onChange={handleChange}>
                  {Object.values(Direction).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject / Topic</label>
              <input
                type="text" name="subject" className="form-input"
                placeholder="e.g. Following up on Q2 expansion, Left VM re: demo"
                value={formData.subject} onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input type="date" name="date" className="form-input" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Outcome *</label>
                <select name="outcome" className="form-select" value={formData.outcome} onChange={handleChange} required>
                  {Object.values(Outcome).map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tone</label>
              <select name="tone" className="form-select" value={formData.tone} onChange={handleChange}>
                {Object.values(Tone).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes / Reflection</label>
              <textarea
                name="reflection" className="form-textarea"
                value={formData.reflection} onChange={handleChange}
                rows={3}
                placeholder="Key takeaways, objections raised, follow-up context..."
              />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {interaction ? 'Save Changes' : 'Log Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditInteractionModal;
