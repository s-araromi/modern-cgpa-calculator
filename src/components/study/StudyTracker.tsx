import React, { useState, useEffect } from 'react';
import { courseAPI } from '../../services/api';
import { useAuth } from '../auth/AuthContext';

interface StudySession {
  id: string;
  courseId: string;
  topic: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  efficiency: number;
  notes: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  semester: string;
}

export const StudyTracker = () => {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [topic, setTopic] = useState('');
  const [efficiency, setEfficiency] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCourses();
    }
  }, [user]);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getAll('current');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession]);

  const handleStartSession = () => {
    if (!selectedCourse) return;
    
    const newSession: StudySession = {
      id: Date.now().toString(),
      courseId: selectedCourse.id,
      topic,
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      efficiency: 0,
      notes: '',
    };
    
    setActiveSession(newSession);
    setTimer(0);
  };

  const handleStopSession = () => {
    if (!activeSession) return;
    setShowEndDialog(true);
  };

  const handleSaveSession = () => {
    if (!activeSession) return;

    const endedSession: StudySession = {
      ...activeSession,
      endTime: new Date().toISOString(),
      duration: timer,
      efficiency,
      notes,
    };

    setStudySessions(prev => [...prev, endedSession]);
    setActiveSession(null);
    setTimer(0);
    setEfficiency(0);
    setNotes('');
    setShowEndDialog(false);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Study Tracker</h2>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={selectedCourse?.id || ''}
              onChange={(e) => {
                const course = courses.find(c => c.id === e.target.value);
                setSelectedCourse(course || null);
              }}
              disabled={!!activeSession}
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={!!activeSession}
              placeholder="What are you studying?"
            />
          </div>
        </div>

        <div className="flex justify-center">
          {!activeSession ? (
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              onClick={handleStartSession}
              disabled={!selectedCourse || !topic}
            >
              Start Study Session
            </button>
          ) : (
            <div className="text-center">
              <div className="text-4xl font-mono mb-4">{formatTime(timer)}</div>
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
                onClick={handleStopSession}
              >
                End Session
              </button>
            </div>
          )}
        </div>
      </div>

      {studySessions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Sessions</h3>
          <div className="space-y-4">
            {studySessions.map(session => {
              const course = courses.find(c => c.id === session.courseId);
              return (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">
                        {course?.code} - {session.topic}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Duration: {formatTime(session.duration)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Efficiency:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= session.efficiency
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  {session.notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      Notes: {session.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showEndDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">End Study Session</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How efficient was your study session?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setEfficiency(star)}
                    className={`p-1 ${
                      star <= efficiency
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Notes
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes about this study session?"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setShowEndDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={handleSaveSession}
              >
                Save Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
