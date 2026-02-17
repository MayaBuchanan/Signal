import { useState, useEffect } from 'react';
import { Relationship, Interaction } from '../types';
import { getRelationships, saveRelationships, getInteractionsByRelationshipId } from '../storage';
import { formatDate } from '../utils';
import InteractionsList from './InteractionsList';
import './RelationshipDetail.css';

interface RelationshipDetailProps {
  relationshipId: string;
  onBack: () => void;
}

function RelationshipDetail({ relationshipId, onBack }: RelationshipDetailProps) {
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');

  useEffect(() => {
    loadRelationship();
    loadInteractions();
  }, [relationshipId]);

  const loadRelationship = () => {
    const relationships = getRelationships();
    const found = relationships.find(r => r.id === relationshipId);
    if (found) {
      setRelationship(found);
      setNotesValue(found.notes);
    }
  };

  const loadInteractions = () => {
    const data = getInteractionsByRelationshipId(relationshipId);
    setInteractions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleSaveNotes = () => {
    if (!relationship) return;
    
    const relationships = getRelationships();
    const updated = relationships.map(r =>
      r.id === relationshipId
        ? { ...r, notes: notesValue, updatedAt: new Date().toISOString() }
        : r
    );
    saveRelationships(updated);
    setRelationship({ ...relationship, notes: notesValue });
    setIsEditingNotes(false);
  };

  const handleInteractionsUpdate = () => {
    loadInteractions();
    // Update the relationship's updatedAt timestamp
    const relationships = getRelationships();
    const updated = relationships.map(r =>
      r.id === relationshipId
        ? { ...r, updatedAt: new Date().toISOString() }
        : r
    );
    saveRelationships(updated);
    loadRelationship();
  };

  if (!relationship) {
    return (
      <div className="relationship-detail">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          ← Back to List
        </button>
        <div className="empty-state">
          <p>Relationship not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relationship-detail">
      <button className="btn btn-secondary back-btn" onClick={onBack}>
        ← Back to List
      </button>

      <div className="detail-header">
        <div className="detail-header-content">
          <h2>{relationship.name}</h2>
          <p className="detail-organization">{relationship.organization}</p>
          <div className="detail-metadata">
            <span className={`stage-badge stage-${relationship.stage.toLowerCase().replace(' ', '-')}`}>
              {relationship.stage}
            </span>
            <span className="metadata-item">
              <strong>Industry:</strong> {relationship.industry || 'N/A'}
            </span>
            <span className="metadata-item">
              <strong>Region:</strong> {relationship.region || 'N/A'}
            </span>
            <span className="metadata-item">
              <strong>Owner:</strong> {relationship.owner || 'N/A'}
            </span>
          </div>
          <div className="detail-dates">
            <span>Created: {formatDate(relationship.createdAt)}</span>
            <span>Updated: {formatDate(relationship.updatedAt)}</span>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <div className="section-header">
          <h3>Notes</h3>
          {!isEditingNotes && (
            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditingNotes(true)}>
              Edit Notes
            </button>
          )}
        </div>
        
        {isEditingNotes ? (
          <div className="notes-editor">
            <textarea
              className="form-textarea"
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              rows={6}
              placeholder="Add notes about this relationship..."
            />
            <div className="notes-actions">
              <button className="btn btn-secondary" onClick={() => {
                setNotesValue(relationship.notes);
                setIsEditingNotes(false);
              }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveNotes}>
                Save Notes
              </button>
            </div>
          </div>
        ) : (
          <div className="notes-display">
            {relationship.notes || <em className="empty-notes">No notes yet</em>}
          </div>
        )}
      </div>

      <div className="detail-section">
        <InteractionsList 
          relationshipId={relationshipId}
          interactions={interactions}
          onUpdate={handleInteractionsUpdate}
        />
      </div>
    </div>
  );
}

export default RelationshipDetail;
