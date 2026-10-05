import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  Calendar,
  Clock,
  GraduationCap,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileUp,
  Layers,
  Sparkles,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import api from '../services/api';

export default function Course({ courseId, onBack, onNavigateTab }) {
  const [course, setCourse] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [activeTab, setActiveTab] = useState('materials');
  const fileInputRef = useRef(null);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [courseData, docsData] = await Promise.all([
        api.courses.get(courseId),
        api.documents.list(courseId),
      ]);
      setCourse(courseData);
      setDocuments(docsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF files are supported.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const newDoc = await api.documents.upload(courseId, file, (progress) => {
        setUploadProgress(progress);
      });
      setDocuments([newDoc, ...documents]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to upload PDF. Please check server connection.';
      setUploadError(msg);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Delete this uploaded PDF?')) return;
    try {
      await api.documents.delete(docId);
      setDocuments(documents.filter((d) => d.id !== docId));
    } catch (err) {
      alert('Could not delete document.');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Course not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
          Course ID: #{course.id}
        </span>
      </div>

      {/* Course Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h2 className="text-2xl font-bold text-slate-900">{course.title}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {course.student_level || 'Intermediate'}
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-2xl">
              {course.description || 'Adaptive course preparation tailored to your target exam timeline.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-center px-3 border-r border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Target</span>
              <p className="text-base font-bold text-slate-800">{course.goal_days} Days</p>
            </div>
            <div className="text-center px-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Commitment</span>
              <p className="text-base font-bold text-slate-800">{course.hours_per_day} hrs/day</p>
            </div>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="flex border-b border-slate-100 mt-6 -mb-2 space-x-6 text-sm font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'materials'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Materials & PDFs ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'roadmap'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Roadmap</span>
            <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold">
              Phase 3
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tutor')}
            className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'tutor'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>AI Tutor</span>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold">
              Phase 2
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'quiz'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Quizzes</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold">
              Phase 4
            </span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'flashcards'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Flashcards</span>
            <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold">
              Phase 6
            </span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Upload Course Materials</h3>
            <p className="text-xs text-slate-500 mb-4">
              Upload textbook chapters, lecture notes, or syllabus slides (.pdf only).
            </p>

            {uploadError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center space-x-2 text-rose-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-sky-500 hover:bg-sky-50/50 rounded-xl p-8 text-center transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 group-hover:scale-110 flex items-center justify-center mx-auto mb-3 transition-transform">
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
                ) : (
                  <FileUp className="w-6 h-6" />
                )}
              </div>
              <h4 className="text-sm font-semibold text-slate-800">
                {uploading ? `Uploading document... ${uploadProgress}%` : 'Click to upload or drag & drop PDF'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                PyMuPDF extracts pages and chunks automatically for RAG grounding.
              </p>

              {uploading && (
                <div className="w-full max-w-xs mx-auto mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-sky-600 h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Uploaded Documents ({documents.length})
            </h3>

            {documents.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No documents uploaded yet. Upload a PDF above to ground the AI Tutor.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="py-4 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{doc.filename}</h4>
                        <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                          <span>{doc.page_count} pages</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.file_size_bytes)}</span>
                          <span>•</span>
                          <span>
                            {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Just now'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Ready
                      </span>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        title="Delete Document"
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Placeholders for upcoming phases */}
      {activeTab === 'roadmap' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Adaptive Roadmap (Phase 3)</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Once syllabus PDFs are ingested, Gemini generates a day-by-day learning schedule adapted to your {course.goal_days}-day target and dynamically shifts when weak topics are detected.
          </p>
        </div>
      )}

      {activeTab === 'tutor' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">RAG-Grounded AI Tutor (Phase 2)</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Ask questions about {course.title}. Answers are retrieved from your uploaded PDFs with exact page numbers and chunk attribution.
          </p>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Concept Quizzes & Diagnostics (Phase 4)</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Auto-generate MCQs from your notes. Quiz results feed the deterministic weak-topic engine to update topic mastery.
          </p>
        </div>
      )}

      {activeTab === 'flashcards' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Spaced Repetition Flashcards (Phase 6)</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Key concepts and weak topics convert into interactive flashcards scheduled with spaced repetition intervals.
          </p>
        </div>
      )}
    </div>
  );
}

