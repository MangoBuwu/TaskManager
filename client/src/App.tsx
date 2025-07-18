// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import History from './pages/History';
import Users from './pages/Users';
import Activities from './pages/Activities';
import Locations from './pages/Locations';
import Reports from './pages/Reports';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/history" element={<History />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;