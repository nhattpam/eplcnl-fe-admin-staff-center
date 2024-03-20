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
import EditCourse from './components/course/EditCourse';
import EditModule from './components/module/EditModule';
import EditClassModule from './components/module/EditClassModule';
import ListLesson from './components/lesson/ListLesson';
import EditTopic from './components/topic/EditTopic';
import ListTopic from './components/topic/ListTopic';
import ListCenterByStaff from './components/center/ListCenterByStaff';
import ListCourseByTutor from './components/course/ListCourseByTutor';
import ListRefundRequest from './components/refund-request/ListRefundRequest';
import EditRefundRequest from './components/refund-request/EditRefundRequest';
import ListQuiz from './components/quiz/ListQuiz';
import EditQuiz from './components/quiz/EditQuiz';
import EditLesson from './components/lesson/EditLesson';
import EditAssignment from './components/assignment/EditAssignment';
import ListAssignment from './components/assignment/ListAssignment';
import ListLessonMaterial from './components/material/ListLessonMaterial';
import ListClassTopicMaterial from './components/material/ListClassTopicMaterial';
import EditQuestion from './components/question/EditQuestion';
import ListReportByStaff from './components/report/ListReportByStaff';
import ListTransaction from './components/transaction/ListTransaction';
import MyWallet from './components/wallet/MyWallet';
import CenterWallet from './components/wallet/CenterWallet';

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
        <Route path="/list-center-by-staff/:staffId" element={<ListCenterByStaff />} />
        <Route path="/edit-center/:id" element={<EditCenter />} />
        <Route path="/list-staff" element={<ListStaff />} />
        <Route path="/create-staff" element={<CreateStaff />} />
        <Route path="/edit-staff/:id" element={<EditStaff />} />
        <Route path="/list-tutor-by-center/:centerId" element={<ListTutorByCenter />} />
        <Route path="/list-tutor-by-staff/:staffId" element={<ListTutorByStaff />} />
        <Route path="/list-tutor" element={<ListTutor />} />
        <Route path="/create-tutor" element={<CreateTutor />} />
        <Route path="/edit-tutor/:id" element={<EditTutor />} />
        <Route path="/list-learner" element={<ListLeaner />} />
        <Route path="/edit-learner/:id" element={<EditLearner />} />
        <Route path="/list-course-active/:staffId" element={<ListCourseActive />} />
        <Route path="/list-course-inactive/:staffId" element={<ListCourseInActive />} />
        <Route path="/list-course-by-tutor/:tutorId" element={<ListCourseByTutor />} />
        <Route path="/admin-home" element={<AdminDashboard />} />
        <Route path="/staff-home" element={<StaffDashboard />} />
        <Route path="/center-home" element={<CenterDashboard />} />
        <Route path="/edit-course/:id" element={<EditCourse />} />
        {/* module */}
        <Route path="/edit-module/:moduleId" element={<EditModule />} />
        <Route path="/edit-class-module/:moduleId" element={<EditClassModule />} />
        {/* lesson */}
        <Route path="/list-lesson/:storedModuleId" element={<ListLesson />} />
        <Route path="/edit-lesson/:lessonId" element={<EditLesson />} />
        {/* quiz */}
        <Route path="/list-quiz/:storedModuleId" element={<ListQuiz />} />
        <Route path="/edit-quiz/:quizId" element={<EditQuiz />} />
        {/* assignment */}
        <Route path="/list-assignment/:storedModuleId" element={<ListAssignment />} />
        <Route path="/edit-assignment/:assignmentId" element={<EditAssignment />} />
        {/* topic */}
        <Route path="/edit-topic/:storedClassTopicId" element={<EditTopic />} />
        <Route path="/list-topic/:storedClassLessonId" element={<ListTopic />} />
        {/* refund request  */}
        <Route path="/list-refund" element={<ListRefundRequest />} />
        <Route path="/edit-refund/:refundId" element={<EditRefundRequest />} />
        {/* question */}
        <Route path="/edit-question/:questionId" element={<EditQuestion />} />
        {/* material */}
        <Route path="/list-material-by-lesson/:storedLessonId" element={<ListLessonMaterial />} />
        <Route path="/list-material-by-topic/:storedClassTopicId" element={<ListClassTopicMaterial />} />
        {/* report */}
        <Route path="/list-report/:staffId" element={<ListReportByStaff />} />
        {/* transaction */}
        <Route path="/list-transaction" element={<ListTransaction />} />
         {/* wallet */}
         <Route path="/my-wallet/:accountId" element={<MyWallet />} />
         <Route path="/center-wallet/:centerId" element={<CenterWallet />} />


      </Routes>
    </div>
  );
}

export default App;
