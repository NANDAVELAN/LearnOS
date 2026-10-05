import React, { useState, useEffect } from 'react';
import {
  Plus,
  BookOpen,
  Calendar,
  Clock,
  Layers,
  ArrowRight,
  Trash2,
  AlertCircle,
  FileText,
  Loader2,
} from 'lucide-react';
import api from '../services/api';

export default function Dashboard({ user, onSelectCourse }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New course form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalDays, setGoalDays] = useState(20);
  const [hoursPerDay, setHoursPerDay] = useState(2.0);
  const [studentLevel, setStudentLevel] = useState('Intermediate');
  const [creating, setCreating] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await api.courses.list();
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const newCourse = await api.courses.create({
        title,
        description,
        goal_days: parseInt(goalDays, 10),
        hours_per_day: parseFloat(hoursPerDay),
        student_level: studentLevel,
      });
      setCourses([newCourse, ...courses]);
      setShowCreateModal(false);
      // Reset form
      setTitle('');
      setDescription('');
      setGoalDays(20);
      setHoursPerDay(2.0);
      setStudentLevel('Intermediate');
      // Directly open course
      if (onSelectCourse) onSelectCourse(newCourse.id);
    } catch (err) {
      alert('Could not create course: ' + (err.response?.data?.detail || err.message));
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCourse = async (courseId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this course and its materials?')) {
      return;
    }
    try {
      await api.courses.delete(courseId);
      setCourses(courses.filter((c) => c.id !== courseId));
    } catch (err) {
      alert('Failed to delete course.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.full_name ? user.full_name.split(' ')[0] : 'Scholar'} 👋
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track your adaptive roadmaps, study sessions, and course materials.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-sky-200 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Course</span>
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Courses</p>
            <h4 className="text-2xl font-bold text-slate-900">{courses.length}</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Target Exam Window</p>
            <h4 className="text-2xl font-bold text-slate-900">
              {courses.length > 0 ? `${courses[0].goal_days} Days` : '20 Days'}
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Daily Study Target</p>
            <h4 className="text-2xl font-bold text-slate-900">
              {courses.length > 0 ? `${courses[0].hours_per_day} hrs` : '2.0 hrs'}
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Study Materials</p>
            <h4 className="text-2xl font-bold text-slate-900">
              {courses.reduce((acc, c) => acc + (c.documents?.length || 0), 0)} PDFs
            </h4>
          </div>
        </div>
      </div>

      {/* Course List Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Your Courses</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-800">No courses created yet</h4>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Create your first course (e.g. Data Mining or Algorithms), set your time goal, and upload syllabus PDFs to begin.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-xl hover:bg-sky-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Course</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => onSelectCourse && onSelectCourse(course.id)}
                className="group cursor-pointer bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {course.student_level || 'Intermediate'}
                    </span>
                    <button
                      onClick={(e) => handleDeleteCourse(course.id, e)}
                      title="Delete course"
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-bold text-slate-900 text-lg group-hover:text-sky-600 transition-colors line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[32px]">
                    {course.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.goal_days} Days Goal</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.hours_per_day}h / day</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500 flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.documents?.length || 0} PDFs</span>
                    </span>
                    <span className="text-xs font-semibold text-sky-600 group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                      <span>Open Course</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Create New Study Course</h3>
            <p className="text-xs text-slate-500 mb-6">
              Define your subject, available prep time, and daily commitment.
            </p>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Data Mining & Warehousing"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Goal
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Master classification, clustering, and association rules for semester exams."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Goal Timeline (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    required
                    value={goalDays}
                    onChange={(e) => setGoalDays(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Study Time (Hours/Day)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={0.5}
                    max={12}
                    required
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Level
                </label>
                <select
                  value={studentLevel}
                  onChange={(e) => setStudentLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-white"
                >
                  <option value="Beginner">Beginner (Foundations first)</option>
                  <option value="Intermediate">Intermediate (Standard depth)</option>
                  <option value="Advanced">Advanced (Accelerated mastery)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-sky-200 transition-all flex items-center space-x-2 disabled:opacity-70"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Create Course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

