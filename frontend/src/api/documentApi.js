import axiosClient from './axiosClient';

export async function fetchDocuments() {
  const response = await axiosClient.get('/api/documents');
  return response.data;
}

// FormData (not JSON) because we're sending a file - axios will
// set the correct multipart/form-data Content-Type automatically
// when it sees a FormData body, overriding our default JSON header.
export async function uploadDocument(title, description, file) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('file', file);

  const response = await axiosClient.post('/api/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}

// Returns the raw axios response (not .data) since we need
// response.headers and response.data as a Blob for the download,
// not a parsed JSON body.
export async function downloadDocument(id) {
  const response = await axiosClient.get(`/api/documents/${id}/download`, {
    responseType: 'blob'
  });
  return response;
}