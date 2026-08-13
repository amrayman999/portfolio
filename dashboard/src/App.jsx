import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context';

const Login = lazy(() => import('./pages/Login'));
const DashboardLayout = lazy(() => import('./pages/DashboardLayout'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const CrudPage = lazy(() => import('./pages/CrudPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function ProtectedRoute({ children }) {
  const { isAuthed } = useApp();
  if (!isAuthed) return <Navigate to="/dashboard/login" replace />;
  return children;
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center text-brand-500 dark:text-brand-300">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path=":collection" element={<CrudPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}