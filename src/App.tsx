import { useState } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import RelationshipsList from './components/RelationshipsList';
import RelationshipDetail from './components/RelationshipDetail';
import SignalBoard from './components/SignalBoard'; // now MetricsDashboard
import PipelineBoard from './components/PipelineBoard';
import ActivityFeed from './components/ActivityFeed';

type Tab = 'pipeline' | 'contacts' | 'signal-board' | 'feed';

function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('pipeline');
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');

  const handleSelectRelationship = (id: string) => {
    setSelectedRelationshipId(id);
  };

  const handleBackToList = () => {
    setSelectedRelationshipId(null);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedRelationshipId(null);
    setGlobalSearch('');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-meta">
          <h1>Signal</h1>
          <p className="app-subtitle">BDR Pipeline Manager</p>
        </div>

        {/* ── Global search (hidden on detail pages, metrics, and feed) ── */}
        {!selectedRelationshipId && activeTab !== 'signal-board' && activeTab !== 'feed' && (
          <div className="header-search">
            <span className="header-search-icon">🔍</span>
            <input
              className="header-search-input"
              type="text"
              placeholder="Search leads, companies, titles…"
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
            />
            {globalSearch && (
              <button className="header-search-clear" onClick={() => setGlobalSearch('')} aria-label="Clear search">✕</button>
            )}
          </div>
        )}

        <div className="header-user">
          <span className="user-name">👤 {user?.name}</span>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      
      <div className="app-layout">
        <nav className="app-nav">
          <button
            className={`nav-tab ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => handleTabChange('pipeline')}
          >
            📊 Pipeline
          </button>
          <button
            className={`nav-tab ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => handleTabChange('contacts')}
          >
            👥 Contacts
          </button>
          <button
            className={`nav-tab ${activeTab === 'signal-board' ? 'active' : ''}`}
            onClick={() => handleTabChange('signal-board')}
          >
            📈 Metrics
          </button>
          <button
            className={`nav-tab ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => handleTabChange('feed')}
          >
            📋 Feed
          </button>
        </nav>

        <main className="app-main">
          {activeTab === 'pipeline' && (
            selectedRelationshipId ? (
              <RelationshipDetail
                relationshipId={selectedRelationshipId}
                onBack={handleBackToList}
              />
            ) : (
              <PipelineBoard
                onSelectRelationship={handleSelectRelationship}
                globalSearch={globalSearch}
              />
            )
          )}

          {activeTab === 'contacts' && (
            selectedRelationshipId ? (
              <RelationshipDetail
                relationshipId={selectedRelationshipId}
                onBack={handleBackToList}
              />
            ) : (
              <RelationshipsList
                onSelectRelationship={handleSelectRelationship}
                globalSearch={globalSearch}
              />
            )
          )}

          {activeTab === 'signal-board' && <SignalBoard />}

          {activeTab === 'feed' && (
            <ActivityFeed
              onSelectRelationship={(id) => {
                setSelectedRelationshipId(id);
                setActiveTab('contacts');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
