import { useState } from 'react';
import { Relationship, Stage } from '../types';

interface AddEditRelationshipModalProps {
  relationship?: Relationship;
  onClose: () => void;
  onSave: (relationship: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function AddEditRelationshipModal({ relationship, onClose, onSave }: AddEditRelationshipModalProps) {
  const [formData, setFormData] = useState({
    name: relationship?.name || '',
    organization: relationship?.organization || '',
    industry: relationship?.industry || '',
    region: relationship?.region || '',
    stage: relationship?.stage || Stage.Exploring,
    owner: relationship?.owner || '',
    notes: relationship?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            {relationship ? 'Edit Relationship' : 'Add Relationship'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Organization *</label>
              <input
                type="text"
                name="organization"
                className="form-input"
                value={formData.organization}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Industry</label>
              <input
                type="text"
                name="industry"
                className="form-input"
                value={formData.industry}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Region</label>
              <input
                type="text"
                name="region"
                className="form-input"
                value={formData.region}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stage *</label>
              <select
                name="stage"
                className="form-select"
                value={formData.stage}
                onChange={handleChange}
                required
              >
                {Object.values(Stage).map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Owner</label>
              <input
                type="text"
                name="owner"
                className="form-input"
                value={formData.owner}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                className="form-textarea"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {relationship ? 'Save Changes' : 'Add Relationship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditRelationshipModal;
