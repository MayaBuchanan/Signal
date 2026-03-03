import { useState } from 'react';
import { Interaction, Outcome, Tone } from '../types';
import { getInteractions, saveInteractions } from '../storage';
import { generateId, formatDate } from '../utils';
import AddEditInteractionModal from './AddEditInteractionModal';
import './InteractionsList.css';

interface InteractionsListProps {
  relationshipId: string;
  interactions: Interaction[];
  onUpdate: () => void;
}

function InteractionsList({ relationshipId, interactions, onUpdate }: InteractionsListProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddInteraction = (interaction: Omit<Interaction, 'id' | 'relationshipId'>) => {
    const allInteractions = getInteractions();
    const newInteraction: Interaction = {
      ...interaction,
      id: generateId(),
      relationshipId
    };
    saveInteractions([...allInteractions, newInteraction]);
    setShowModal(false);
    onUpdate();
  };

  const handleEditInteraction = (id: string, interaction: Omit<Interaction, 'id' | 'relationshipId'>) => {
    const allInteractions = getInteractions();
    const updated = allInteractions.map(i =>
      i.id === id ? { ...interaction, id, relationshipId } : i
    );
    saveInteractions(updated);
    setEditingInteraction(null);
    onUpdate();
  };

  const handleDeleteInteraction = (id: string) => {
    const allInteractions = getInteractions();
    const updated = allInteractions.filter(i => i.id !== id);
    saveInteractions(updated);
    setDeleteConfirm(null);
    onUpdate();
  };

  const getToneColor = (tone: Tone) => {
    switch (tone) {
      case Tone.Energizing:
        return 'tone-energizing';
      case Tone.Neutral:
        return 'tone-neutral';
      case Tone.Draining:
        return 'tone-draining';
      default:
        return '';
    }
  };

  const getOutcomeColor = (outcome: Outcome) => {
    switch (outcome) {
      case Outcome.Positive:
        return 'outcome-positive';
      case Outcome.Neutral:
        return 'outcome-neutral';
      case Outcome.NoResponse:
        return 'outcome-no-response';
      default:
        return '';
    }
  };

  return (
    <div className="interactions-list">
      <div className="section-header">
        <h3>Interactions</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          + Add Interaction
        </button>
      </div>

      {interactions.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem 1rem' }}>
          <div className="empty-state-icon">💬</div>
          <h3>No interactions yet</h3>
          <p>Start tracking your engagement by adding the first interaction</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add First Interaction
          </button>
        </div>
      ) : (
        <div className="interactions-timeline">
          {interactions.map(interaction => (              <div key={interaction.id} className="interaction-item">
              <div className="interaction-header">
                <div className="interaction-type-date">
                  <span className="interaction-type">{interaction.type}</span>
                  {interaction.direction && (
                    <span className={`interaction-direction direction-${interaction.direction.toLowerCase()}`}>
                      {interaction.direction === 'Outbound' ? '↑' : '↓'} {interaction.direction}
                    </span>
                  )}
                  <span className="interaction-date">{formatDate(interaction.date)}</span>
                </div>
                <div className="interaction-badges">
                  <span className={`badge ${getOutcomeColor(interaction.outcome)}`}>
                    {interaction.outcome}
                  </span>
                  <span className={`badge ${getToneColor(interaction.tone)}`}>
                    {interaction.tone}
                  </span>
                </div>
              </div>

              {interaction.subject && (
                <p className="interaction-subject">"{interaction.subject}"</p>
              )}

              {interaction.reflection && (
                <p className="interaction-reflection">{interaction.reflection}</p>
              )}

              <div className="interaction-actions">
                <button 
                  className="btn-link"
                  onClick={() => setEditingInteraction(interaction)}
                >
                  Edit
                </button>
                <button 
                  className="btn-link btn-link-danger"
                  onClick={() => setDeleteConfirm(interaction.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddEditInteractionModal
          onClose={() => setShowModal(false)}
          onSave={handleAddInteraction}
        />
      )}

      {editingInteraction && (
        <AddEditInteractionModal
          interaction={editingInteraction}
          onClose={() => setEditingInteraction(null)}
          onSave={(data: Omit<Interaction, 'id' | 'relationshipId'>) => handleEditInteraction(editingInteraction.id, data)}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this interaction?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteInteraction(deleteConfirm)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InteractionsList;
