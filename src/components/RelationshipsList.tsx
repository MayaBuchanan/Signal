import { useState, useEffect } from 'react';
import { Relationship, Stage } from '../types';
import { getRelationships } from '../storage';
import { apiClient } from '../api/client';
import { syncService } from '../services/sync';
import { formatDate } from '../utils';
import AddEditRelationshipModal from './AddEditRelationshipModal';
import './RelationshipsList.css';

interface RelationshipsListProps {
  onSelectRelationship: (id: string) => void;
}

function RelationshipsList({ onSelectRelationship }: RelationshipsListProps) {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<Stage | 'all'>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadRelationships();
    
    // Sync from cloud on mount
    syncFromCloud();
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

  const handleAddRelationship = async (relationship: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Create in cloud
      await apiClient.createRelationship(relationship);
      
      // Refresh from cloud
      await syncService.syncFromCloud();
      loadRelationships();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to add relationship:', error);
      alert('Failed to add relationship. Please try again.');
    }
  };

  const handleEditRelationship = async (id: string, relationship: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Update in cloud
      await apiClient.updateRelationship(id, relationship);
      
      // Refresh from cloud
      await syncService.syncFromCloud();
      loadRelationships();
      setEditingRelationship(null);
    } catch (error) {
      console.error('Failed to update relationship:', error);
      alert('Failed to update relationship. Please try again.');
    }
  };

  const handleDeleteRelationship = async (id: string) => {
    try {
      // Delete from cloud
      await apiClient.deleteRelationship(id);
      
      // Refresh from cloud
      await syncService.syncFromCloud();
      loadRelationships();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete relationship:', error);
      alert('Failed to delete relationship. Please try again.');
    }
  };

  const openEditModal = (relationship: Relationship) => {
    setEditingRelationship(relationship);
  };

  // Filter relationships
  const filteredRelationships = relationships.filter(relationship => {
    const matchesSearch = searchQuery === '' || 
      relationship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      relationship.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      relationship.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStage = stageFilter === 'all' || relationship.stage === stageFilter;
    
    const matchesIndustry = industryFilter === 'all' || relationship.industry === industryFilter;
    
    return matchesSearch && matchesStage && matchesIndustry;
  });

  // Get unique industries
  const industries = Array.from(new Set(relationships.map(r => r.industry))).filter(Boolean);

  return (
    <div className="relationships-list">
      <div className="list-header">
        <h2>Relationships</h2>
        <div className="header-actions">
          <button 
            className="btn btn-secondary" 
            onClick={syncFromCloud}
            disabled={isSyncing}
          >
            {isSyncing ? '🔄 Syncing...' : '🔄 Sync'}
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Relationship
          </button>
        </div>
      </div>

      <div className="list-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by name, organization, or notes..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Stage:</label>
            <select 
              className="filter-select"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as Stage | 'all')}
            >
              <option value="all">All Stages</option>
              {Object.values(Stage).map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Industry:</label>
            <select 
              className="filter-select"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="all">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredRelationships.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No relationships found</h3>
          <p>{relationships.length === 0 
            ? 'Get started by adding your first relationship'
            : 'Try adjusting your search or filters'
          }</p>
          {relationships.length === 0 && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Add Your First Relationship
            </button>
          )}
        </div>
      ) : (
        <div className="relationships-grid">
          {filteredRelationships.map(relationship => (
            <div key={relationship.id} className="relationship-card">
              <div className="card-header">
                <div>
                  <h3 
                    className="card-title"
                    onClick={() => onSelectRelationship(relationship.id)}
                  >
                    {relationship.name}
                  </h3>
                  <p className="card-organization">{relationship.organization}</p>
                </div>
                <span className={`stage-badge stage-${relationship.stage.toLowerCase().replace(' ', '-')}`}>
                  {relationship.stage}
                </span>
              </div>
              
              <div className="card-details">
                <div className="card-detail-item">
                  <span className="detail-label">Industry:</span>
                  <span className="detail-value">{relationship.industry || 'N/A'}</span>
                </div>
                <div className="card-detail-item">
                  <span className="detail-label">Region:</span>
                  <span className="detail-value">{relationship.region || 'N/A'}</span>
                </div>
                <div className="card-detail-item">
                  <span className="detail-label">Owner:</span>
                  <span className="detail-value">{relationship.owner || 'N/A'}</span>
                </div>
                <div className="card-detail-item">
                  <span className="detail-label">Updated:</span>
                  <span className="detail-value">{formatDate(relationship.updatedAt)}</span>
                </div>
              </div>

              {relationship.notes && (
                <p className="card-notes">{relationship.notes.substring(0, 100)}{relationship.notes.length > 100 ? '...' : ''}</p>
              )}

              <div className="card-actions">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => onSelectRelationship(relationship.id)}
                >
                  View Details
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => openEditModal(relationship)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeleteConfirm(relationship.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddEditRelationshipModal
          onClose={() => setShowModal(false)}
          onSave={handleAddRelationship}
        />
      )}

      {editingRelationship && (
        <AddEditRelationshipModal
          relationship={editingRelationship}
          onClose={() => setEditingRelationship(null)}
          onSave={(data: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>) => handleEditRelationship(editingRelationship.id, data)}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this relationship? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteRelationship(deleteConfirm)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RelationshipsList;
