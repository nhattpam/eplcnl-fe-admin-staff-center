import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import ListCenter from './components/center/ListCenter';
import ListStaff from './components/staff/ListStaff';
import EditStaff from './components/staff/EditStaff';
import ListTutor from './components/tutor/ListTutor';
import EditTutor from './components/tutor/EditTutor';
import EditCenter from './components/center/EditCenter';
import ListLeaner from './components/learner/ListLeaner';
import EditLearner from './components/learner/EditLearner';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/list-center" element={<ListCenter />} />
        <Route path="/edit-center" element={<EditCenter />} />
        <Route path="/list-staff" element={<ListStaff />} />
        <Route path="/edit-staff" element={<EditStaff />} />
        <Route path="/list-tutor" element={<ListTutor />} />
        <Route path="/edit-staff" element={<EditTutor />} />
        <Route path="/list-learner" element={<ListLeaner />} />
        <Route path="/edit-learner" element={<EditLearner />} />

      </Routes>
    </div>
  );
}

export default App;
