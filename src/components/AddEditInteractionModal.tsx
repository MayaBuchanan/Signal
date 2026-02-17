import { useState } from 'react';
import { Interaction, InteractionType, Outcome, Tone } from '../types';

interface AddEditInteractionModalProps {
  interaction?: Interaction;
  onClose: () => void;
  onSave: (interaction: Omit<Interaction, 'id' | 'relationshipId'>) => void;
}

function AddEditInteractionModal({ interaction, onClose, onSave }: AddEditInteractionModalProps) {
  const [formData, setFormData] = useState({
    type: interaction?.type || InteractionType.Meeting,
    date: interaction?.date ? interaction.date.split('T')[0] : new Date().toISOString().split('T')[0],
    outcome: interaction?.outcome || Outcome.Neutral,
    tone: interaction?.tone || Tone.Neutral,
    reflection: interaction?.reflection || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      date: new Date(formData.date).toISOString()
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {interaction ? 'Edit Interaction' : 'Add Interaction'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {Object.values(InteractionType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Outcome *</label>
              <select
                name="outcome"
                className="form-select"
                value={formData.outcome}
                onChange={handleChange}
                required
              >
                {Object.values(Outcome).map(outcome => (
                  <option key={outcome} value={outcome}>{outcome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tone *</label>
              <select
                name="tone"
                className="form-select"
                value={formData.tone}
                onChange={handleChange}
                required
              >
                {Object.values(Tone).map(tone => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reflection</label>
              <textarea
                name="reflection"
                className="form-textarea"
                value={formData.reflection}
                onChange={handleChange}
                rows={4}
                placeholder="Add notes about this interaction..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {interaction ? 'Save Changes' : 'Add Interaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditInteractionModal;
