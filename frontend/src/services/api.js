import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to inject JWT bearer token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 unauthorized gracefully
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and trigger event for app to redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const api = {
  // --- Auth Service ---
  auth: {
    async register(email, password, fullName) {
      const response = await client.post('/auth/register', {
        email,
        password,
        full_name: fullName,
      });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    },

    async login(email, password) {
      const response = await client.post('/auth/login', {
        email,
        password,
      });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    },

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
    },

    getCurrentUser() {
      const userStr = localStorage.getItem('user');
      try {
        return userStr ? JSON.parse(userStr) : null;
      } catch {
        return null;
      }
    },

    async fetchMe() {
      const response = await client.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    },

    isAuthenticated() {
      return !!localStorage.getItem('token');
    },
  },

  // --- Courses Service ---
  courses: {
    async list() {
      const response = await client.get('/courses');
      return response.data;
    },

    async get(courseId) {
      const response = await client.get(`/courses/${courseId}`);
      return response.data;
    },

    async create(data) {
      const response = await client.post('/courses', data);
      return response.data;
    },

    async update(courseId, data) {
      const response = await client.put(`/courses/${courseId}`, data);
      return response.data;
    },

    async delete(courseId) {
      const response = await client.delete(`/courses/${courseId}`);
      return response.data;
    },
  },

  // --- Documents Service ---
  documents: {
    async upload(courseId, file, onUploadProgress = null) {
      const formData = new FormData();
      formData.append('course_id', courseId);
      formData.append('file', file);

      const response = await client.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgress(percent);
          }
        },
      });
      return response.data;
    },

    async list(courseId = null) {
      const url = courseId ? `/documents?course_id=${courseId}` : '/documents';
      const response = await client.get(url);
      return response.data;
    },

    async get(documentId) {
      const response = await client.get(`/documents/${documentId}`);
      return response.data;
    },

    async delete(documentId) {
      const response = await client.delete(`/documents/${documentId}`);
      return response.data;
    },
  },

  // --- System Service ---
  system: {
    async health() {
      const response = await client.get('/health');
      return response.data;
    },
  },
};

export default api;

