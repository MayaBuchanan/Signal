import { useState, useEffect } from 'react';
import { Relationship, Interaction, Tone } from '../types';
import { getRelationships, getInteractions } from '../storage';
import { formatDate } from '../utils';
import './SignalBoard.css';

function SignalBoard() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRelationships(getRelationships());
    setInteractions(getInteractions());
  };

  // Calculate signal metrics
  const getRelationshipSignal = (relationship: Relationship): { score: number; label: string; color: string } => {
    const relInteractions = interactions.filter(i => i.relationshipId === relationship.id);
    
    if (relInteractions.length === 0) {
      return { score: 0, label: 'No Data', color: 'gray' };
    }

    // Get recent interactions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentInteractions = relInteractions.filter(
      i => new Date(i.date) >= thirtyDaysAgo
    );

    // Calculate engagement score
    let score = 0;
    
    // Frequency score (0-40 points)
    score += Math.min(recentInteractions.length * 10, 40);
    
    // Tone score (0-30 points)
    const energizingCount = recentInteractions.filter(i => i.tone === Tone.Energizing).length;
    const drainingCount = recentInteractions.filter(i => i.tone === Tone.Draining).length;
    score += (energizingCount * 10) - (drainingCount * 5);
    
    // Recency score (0-30 points)
    const lastInteraction = relInteractions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    const daysSinceLastInteraction = Math.floor(
      (Date.now() - new Date(lastInteraction.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    score += Math.max(30 - daysSinceLastInteraction, 0);

    // Normalize to 0-100
    score = Math.max(0, Math.min(100, score));

    // Determine label and color
    if (score >= 70) {
      return { score, label: 'Strong', color: 'green' };
    } else if (score >= 40) {
      return { score, label: 'Moderate', color: 'yellow' };
    } else {
      return { score, label: 'Weak', color: 'red' };
    }
  };

  const relationshipsWithSignals = relationships.map(rel => ({
    ...rel,
    signal: getRelationshipSignal(rel)
  }));

  const strongSignals = relationshipsWithSignals.filter(r => r.signal.label === 'Strong');
  const moderateSignals = relationshipsWithSignals.filter(r => r.signal.label === 'Moderate');
  const weakSignals = relationshipsWithSignals.filter(r => r.signal.label === 'Weak');
  const noDataSignals = relationshipsWithSignals.filter(r => r.signal.label === 'No Data');

  return (
    <div className="signal-board">
      <div className="board-header">
        <h2>Signal Board</h2>
        <p className="board-subtitle">Overview of relationship engagement strength</p>
      </div>

      {relationships.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>No relationships to analyze</h3>
          <p>Add relationships and track interactions to see engagement signals</p>
        </div>
      ) : (
        <>
          <div className="signal-summary">
            <div className="summary-card summary-strong">
              <div className="summary-count">{strongSignals.length}</div>
              <div className="summary-label">Strong Signals</div>
            </div>
            <div className="summary-card summary-moderate">
              <div className="summary-count">{moderateSignals.length}</div>
              <div className="summary-label">Moderate Signals</div>
            </div>
            <div className="summary-card summary-weak">
              <div className="summary-count">{weakSignals.length}</div>
              <div className="summary-label">Weak Signals</div>
            </div>
            <div className="summary-card summary-no-data">
              <div className="summary-count">{noDataSignals.length}</div>
              <div className="summary-label">No Data</div>
            </div>
          </div>

          <div className="signal-sections">
            {strongSignals.length > 0 && (
              <div className="signal-section">
                <h3 className="section-title signal-strong">💚 Strong Signals</h3>
                <div className="signal-cards">
                  {strongSignals.map(rel => (
                    <SignalCard key={rel.id} relationship={rel} interactions={interactions} />
                  ))}
                </div>
              </div>
            )}

            {moderateSignals.length > 0 && (
              <div className="signal-section">
                <h3 className="section-title signal-moderate">💛 Moderate Signals</h3>
                <div className="signal-cards">
                  {moderateSignals.map(rel => (
                    <SignalCard key={rel.id} relationship={rel} interactions={interactions} />
                  ))}
                </div>
              </div>
            )}

            {weakSignals.length > 0 && (
              <div className="signal-section">
                <h3 className="section-title signal-weak">❤️ Weak Signals - Needs Attention</h3>
                <div className="signal-cards">
                  {weakSignals.map(rel => (
                    <SignalCard key={rel.id} relationship={rel} interactions={interactions} />
                  ))}
                </div>
              </div>
            )}

            {noDataSignals.length > 0 && (
              <div className="signal-section">
                <h3 className="section-title signal-no-data">⚪ No Interaction Data</h3>
                <div className="signal-cards">
                  {noDataSignals.map(rel => (
                    <SignalCard key={rel.id} relationship={rel} interactions={interactions} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface SignalCardProps {
  relationship: Relationship & { signal: { score: number; label: string; color: string } };
  interactions: Interaction[];
}

function SignalCard({ relationship, interactions }: SignalCardProps) {
  const relInteractions = interactions.filter(i => i.relationshipId === relationship.id);
  const lastInteraction = relInteractions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  return (
    <div className="signal-card">
      <div className="signal-card-header">
        <div>
          <h4 className="signal-card-name">{relationship.name}</h4>
          <p className="signal-card-org">{relationship.organization}</p>
        </div>
        <div className={`signal-score signal-${relationship.signal.color}`}>
          {relationship.signal.score}
        </div>
      </div>
      <div className="signal-card-details">
        <div className="signal-detail">
          <span className="signal-detail-label">Stage:</span>
          <span className={`stage-badge stage-${relationship.stage.toLowerCase().replace(' ', '-')}`}>
            {relationship.stage}
          </span>
        </div>
        <div className="signal-detail">
          <span className="signal-detail-label">Interactions:</span>
          <span>{relInteractions.length}</span>
        </div>
        {lastInteraction && (
          <div className="signal-detail">
            <span className="signal-detail-label">Last Contact:</span>
            <span>{formatDate(lastInteraction.date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignalBoard;
