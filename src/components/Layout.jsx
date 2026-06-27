import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import SOSAlert from './SOSAlert';

const Layout = ({ allowedRoles }) => {
  const { activeUser } = useContext(AppContext);

  // If not logged in, redirect to landing
  if (!activeUser) {
    return <Navigate to="/" replace />;
  }

  // If role not allowed, redirect to landing
  if (allowedRoles && !allowedRoles.includes(activeUser.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
          <div className="max-w-7xl mx-auto fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
      <SOSAlert />
    </div>
  );
};

export default Layout;
