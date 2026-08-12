import { downloadDocument } from '../api/documentApi';
import { triggerBrowserDownload } from '../utils/downloadHelper';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentList({ documents, onDownloadError }) {
  async function handleDownload(doc) {
    try {
      const response = await downloadDocument(doc.id);
      triggerBrowserDownload(response.data, doc.file_name);
    } catch (err) {
      onDownloadError(`Failed to download "${doc.title}"`);
    }
  }

 if (documents.length === 0) {
  return (
    <div style={{ padding: '35px', textAlign: 'center', color: '#667085' }}>
      No documents uploaded yet.
    </div>
  );
}

  return (
    <table className="document-table">
  <thead>
    <tr>
      <th>Document</th>
      <th>Uploaded by</th>
      <th>Size</th>
      <th>Date</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {documents.map((doc) => (
      <tr key={doc.id}>
        <td>
          <div className="document-name">{doc.title}</div>

          {doc.description && (
            <div className="document-description">
              {doc.description}
            </div>
          )}
        </td>

        <td>{doc.uploaded_by_username}</td>

        <td>{formatFileSize(doc.file_size)}</td>

        <td>
          {new Date(doc.created_at).toLocaleDateString()}
        </td>

        <td>
          <button
            className="download-button"
            onClick={() => handleDownload(doc)}
          >
            Download
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
  );
}

export default DocumentList;