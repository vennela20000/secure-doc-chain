import { useState, useEffect, useCallback } from 'react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchDocuments } from '../api/documentApi';
import DocumentList from '../components/DocumentList';
import UploadForm from '../components/uploadForm';

const UPLOAD_ROLES = ['admin', 'engineer'];

function DashboardPage() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ Hook MUST be inside the component
  const [activePage, setActivePage] = useState('dashboard');

  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // rest of your code...

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchDocuments();
      setDocuments(data.documents);
    } catch (err) {
      setError('Failed to load documents.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const canUpload = user && UPLOAD_ROLES.includes(user.role || user.role_name);

  return (
  <div className="dashboard">
    <aside className="sidebar">
      <div className="sidebar-logo">
        Secure<span>Doc</span>Chain
      </div>

      <div className="sidebar-section-title">Workspace</div>

      <div className="sidebar-link active">
        ◈
        Dashboard
      </div>

      <div className="sidebar-link">
        ▣
        Documents
      </div>

      <div className="sidebar-link">
        ✓
        Approvals
      </div>

      <div className="sidebar-link">
        ◉
        Verification
      </div>

      <div className="sidebar-section-title" style={{ marginTop: '28px' }}>
        Security
      </div>

      <div className="sidebar-link">
        ⛓
        Blockchain
      </div>

      <div className="sidebar-link">
        ◌
        Audit Logs
      </div>
    </aside>

    <main className="dashboard-main">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Document Workspace</h1>
          <p>Manage and verify your organization's documents.</p>
        </div>

        <div className="user-area">
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-role">
              {user?.role || user?.role_name}
            </div>
          </div>

          <div className="avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">TOTAL DOCUMENTS</div>
            <div className="stat-value">{documents.length}</div>
            <div className="stat-description">
              Documents in workspace
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">ACCESS LEVEL</div>
            <div className="stat-value" style={{ fontSize: '22px' }}>
              {user?.role || user?.role_name}
            </div>
            <div className="stat-description">
              Current account role
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">INTEGRITY</div>
            <div className="stat-value" style={{ fontSize: '22px' }}>
              Protected
            </div>
            <div className="stat-description">
              Secure document workflow
            </div>
          </div>
        </div>

        {canUpload && (
          <div className="content-card">
            <div className="content-card-header">
              <div>
                <h2>Upload document</h2>
                <p>Add a new document to the secure workspace.</p>
              </div>
            </div>

            <div className="content-card-body">
              <UploadForm onUploadSuccess={loadDocuments} />
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="content-card">
          <div className="content-card-header">
            <div>
              <h2>Documents</h2>
              <p>Files currently available in the workspace.</p>
            </div>
          </div>

          <div className="content-card-body">
            {isLoading ? (
              <p>Loading documents...</p>
            ) : (
              <DocumentList
                documents={documents}
                onDownloadError={setError}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  </div>
);
}

export default DashboardPage;