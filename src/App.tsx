import { useState } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import RelationshipsList from './components/RelationshipsList';
import RelationshipDetail from './components/RelationshipDetail';
import SignalBoard from './components/SignalBoard';

type Tab = 'signal-board' | 'relationships';

function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('relationships');
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);

  const handleSelectRelationship = (id: string) => {
    setSelectedRelationshipId(id);
  };

  const handleBackToList = () => {
    setSelectedRelationshipId(null);
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
        <div>
          <h1>Signal</h1>
          <p className="app-subtitle">Engagement & Relationship Insight Tool</p>
        </div>
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
            className={`nav-tab ${activeTab === 'signal-board' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('signal-board');
              setSelectedRelationshipId(null);
            }}
          >
            Signal Board
          </button>
          <button 
            className={`nav-tab ${activeTab === 'relationships' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('relationships');
              setSelectedRelationshipId(null);
            }}
          >
            Relationships
          </button>
        </nav>
        
        <main className="app-main">
          {activeTab === 'signal-board' && <SignalBoard />}
          
          {activeTab === 'relationships' && (
            selectedRelationshipId ? (
              <RelationshipDetail 
                relationshipId={selectedRelationshipId}
                onBack={handleBackToList}
              />
            ) : (
              <RelationshipsList onSelectRelationship={handleSelectRelationship} />
            )
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
