import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getProfile, signInUser, signUpUser, signOutUser, signInStudentByNameAndDob } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Synchronize state with Supabase Auth Session
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (isMounted) setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          // Check local stored student session
          const savedStudentStr = localStorage.getItem('lvt54_student_profile');
          if (savedStudentStr) {
            try {
              const savedProf = JSON.parse(savedStudentStr);
              if (isMounted) setProfile(savedProf);
            } catch (e) {
              console.warn(e);
            }
          } else {
            if (isMounted) {
              setUser(null);
              setProfile(null);
            }
          }
        }
      } catch (err) {
        console.error('Error getting auth session:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      } else {
        const savedStudentStr = localStorage.getItem('lvt54_student_profile');
        if (!savedStudentStr) {
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function loadProfile(userId) {
    try {
      const p = await getProfile(userId);
      setProfile(p);
      return p;
    } catch (err) {
      console.warn('Profile fetch note:', err.message);
      const fallback = {
        id: userId,
        email: user?.email || '',
        full_name: user?.user_metadata?.full_name || 'Người dùng',
        role: user?.user_metadata?.role || 'student',
        avatar_url: '',
        points: 0,
        stars: 0
      };
      setProfile(fallback);
      return fallback;
    }
  }

  async function login(email, password) {
    setLoading(true);
    try {
      localStorage.removeItem('lvt54_student_profile');
      const data = await signInUser({ email, password });
      if (data.user) {
        setUser(data.user);
        await loadProfile(data.user.id);
      }
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function loginStudentByNameAndDob(fullName, dob) {
    setLoading(true);
    try {
      const studentProf = await signInStudentByNameAndDob(fullName, dob);
      if (studentProf) {
        setProfile(studentProf);
        localStorage.setItem('lvt54_student_profile', JSON.stringify(studentProf));
        return studentProf;
      }
    } finally {
      setLoading(false);
    }
  }

  async function register(email, password, fullName, role = 'student', avatarUrl = '', dob = '') {
    setLoading(true);
    try {
      const data = await signUpUser({ email, password, fullName, role, avatarUrl, dob });
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      localStorage.removeItem('lvt54_student_profile');
      if (user) {
        await signOutUser();
      }
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  const role = profile?.role || 'guest';
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher' || role === 'admin';
  const isStudent = role === 'student';

  const value = {
    user,
    profile,
    role,
    isAdmin,
    isTeacher,
    isStudent,
    loading,
    login,
    loginStudentByNameAndDob,
    register,
    logout,
    refreshProfile: () => user && loadProfile(user.id)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
