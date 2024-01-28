import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import ListCenter from './components/center/ListCenter';
import ListStaff from './components/staff/ListStaff';
import EditStaff from './components/staff/EditStaff';
import ListTutorByCenter from './components/tutor/ListTutorByCenter';
import EditTutor from './components/tutor/EditTutor';
import EditCenter from './components/center/EditCenter';
import ListLeaner from './components/learner/ListLeaner';
import EditLearner from './components/learner/EditLearner';
import CreateTutor from './components/tutor/CreateTutor';
import SignIn from './components/SignIn';
import { useState, useEffect } from 'react';
import ListTutor from './components/tutor/ListTutor';
import ListCourseInActive from './components/course/ListCourseInActive';
import ListCourseActive from './components/course/ListCourseActive';
import AdminDashboard from './components/dashboard/AdminDashboard';
import CenterDashboard from './components/dashboard/CenterDashboard';
import StaffDashboard from './components/dashboard/StaffDashboard';
import ListTutorByStaff from './components/tutor/ListTutorByStaff';
import CreateStaff from './components/staff/CreateStaff';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add a state for login status

  useEffect(() => {
    // Check if the user is already logged in by retrieving the login status from local storage
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(storedLoginStatus === 'true');

  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={<SignIn setIsLoggedIn={setIsLoggedIn} />} // Pass setIsLoggedIn prop to Login component
        />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/list-center" element={<ListCenter />} />
        <Route path="/edit-center/:id" element={<EditCenter />} />
        <Route path="/list-staff" element={<ListStaff />} />
        <Route path="/create-staff" element={<CreateStaff />} />
        <Route path="/edit-staff" element={<EditStaff />} />
        <Route path="/list-tutor-by-center/:centerId" element={<ListTutorByCenter />} />
        <Route path="/list-tutor-by-staff/:staffId" element={<ListTutorByStaff />} />
        <Route path="/list-tutor" element={<ListTutor />} />
        <Route path="/create-tutor" element={<CreateTutor />} />
        <Route path="/edit-tutor/:id" element={<EditTutor />} />
        <Route path="/list-learner" element={<ListLeaner />} />
        <Route path="/edit-learner" element={<EditLearner />} />
        <Route path="/list-course-active" element={<ListCourseActive />} />
        <Route path="/list-course-inactive" element={<ListCourseInActive />} />
        <Route path="/admin-home" element={<AdminDashboard />} />
        <Route path="/staff-home" element={<StaffDashboard />} />
        <Route path="/center-home" element={<CenterDashboard />} />

      </Routes>
    </div>
  );
}

export default App;
