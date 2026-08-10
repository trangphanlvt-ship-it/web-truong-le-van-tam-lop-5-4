import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import SubjectLearning from './components/SubjectLearning';
import ClassActivities from './components/ClassActivities';
import Announcements from './components/Announcements';
import QuizModal from './components/QuizModal';
import HCMCulturalSpace from './components/HCMCulturalSpace';
import HonorBoard from './components/HonorBoard';
import ClassRoster from './components/ClassRoster';
import QuestionBuilder from './components/QuestionBuilder';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';

// Pages
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

import { useAuth } from './context/AuthContext';
import { INITIAL_STUDENTS, SUBJECTS_DATA } from './data/classData';
import { fetchStudentsFromSupabase, fetchCustomQuestionsFromSupabase, updateStudentPointsInSupabase } from './lib/supabase';

export default function App() {
  const { user, profile, isAdmin, isTeacher } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [subjects, setSubjects] = useState(SUBJECTS_DATA);
  const [activeGame, setActiveGame] = useState(null);

  // Synchronize student leaderboard and custom questions from DB
  useEffect(() => {
    async function loadData() {
      const sbStudents = await fetchStudentsFromSupabase();
      if (sbStudents && sbStudents.length > 0) {
        setStudents(sbStudents);
      }

      const sbQuestions = await fetchCustomQuestionsFromSupabase();
      if (sbQuestions && sbQuestions.length > 0) {
        setSubjects(prevSubjs => {
          const newSubjs = [...prevSubjs];
          sbQuestions.forEach(q => {
            const subj = newSubjs.find(s => s.id === q.subjectId);
            if (subj && subj.games.length > 0) {
              const exists = subj.games[0].questions.some(ex => ex.q === q.q);
              if (!exists) {
                subj.games[0].questions.push(q);
              }
            }
          });
          return newSubjs;
        });
      }
    }

    loadData();
  }, []);

  function handleAddQuestion(newQ) {
    setSubjects(prev => {
      const newSubjs = [...prev];
      const subj = newSubjs.find(s => s.id === newQ.subjectId);
      if (subj && subj.games.length > 0) {
        subj.games[0].questions.push(newQ);
      }
      return newSubjs;
    });
  }

  async function handleCompleteGame(earnedScore, earnedStars) {
    if (!profile) return;
    const newPoints = (profile.points || 0) + earnedScore;
    const newStars = (profile.stars || 0) + earnedStars;

    setStudents(prev => prev.map(st => st.id === profile.id ? { ...st, points: newPoints, stars: newStars } : st));
    await updateStudentPointsInSupabase(profile.id, newPoints, newStars);
  }

  return (
    <div>
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="app-main-layout">
        {activeSection === 'home' && <HeroBanner activeUser={profile} />}
        {activeSection === 'subjects' && <SubjectLearning subjects={subjects} onLaunchGame={game => setActiveGame(game)} />}
        {activeSection === 'activities' && <ClassActivities />}
        {activeSection === 'announcements' && <Announcements />}
        {activeSection === 'hcm-space' && <HCMCulturalSpace />}
        {activeSection === 'leaderboard' && <HonorBoard students={students} activeUser={profile} />}
        {activeSection === 'class-list' && <ClassRoster students={students} />}
        {activeSection === 'teacher-builder' && <QuestionBuilder subjects={subjects} onAddQuestion={handleAddQuestion} />}

        {/* Auth & Role Dashboards */}
        {activeSection === 'auth' && <AuthPage />}
        {activeSection === 'admin-dashboard' && <AdminDashboard />}
        {activeSection === 'teacher-dashboard' && <TeacherDashboard />}
        {activeSection === 'student-dashboard' && <StudentDashboard />}
      </main>

      {activeGame && (
        <QuizModal
          game={activeGame}
          onClose={() => setActiveGame(null)}
          activeUser={profile}
          onCompleteGame={handleCompleteGame}
        />
      )}

      <AIAssistant />
      <Footer />
    </div>
  );
}
