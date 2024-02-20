import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moduleService from '../../services/module.service';

const EditModule = () => {
    const [module, setModule] = useState({
        name: "",
        assignments: [],
        lessons: [],
        quizzes: []
    });

    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const { moduleId } = useParams();
    //get number of lessons, assignments, quizzes
    const [lessonList, setLessonList] = useState([]);
    const [quizList, setQuizList] = useState([]);
    const [assignmentList, setAssignmentList] = useState([]);


    useEffect(() => {
        if (moduleId) {
            moduleService
                .getModuleById(moduleId)
                .then((res) => {
                    setModule(res.data);
                    // console.log(module)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [moduleId]);

    useEffect(() => {
        moduleService
            .getAllLessonsByModule(moduleId)
            .then((res) => {
                console.log(res.data);
                setLessonList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [moduleId]);

    useEffect(() => {
        moduleService
            .getAllAssignmentsByModule(moduleId)
            .then((res) => {
                console.log(res.data);
                setAssignmentList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [moduleId]);

    useEffect(() => {
        moduleService
            .getAllQuizzesByModule(moduleId)
            .then((res) => {
                console.log(res.data);
                setQuizList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [moduleId]);

    const handleEditModule = (moduleId) => {
        // Add logic to navigate to the module edit page with the moduleId
        navigate(`/edit-module/${moduleId}`);
    };

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar isAdmin={sessionStorage.getItem('isAdmin') === 'true'}
                    isStaff={sessionStorage.getItem('isStaff') === 'true'}
                    isCenter={sessionStorage.getItem('isCenter') === 'true'} />
                <div className="content-page">
                    {/* Start Content*/}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card-box">
                                    <h4 className="header-title">COURSE - <span className='text-success'>{module.course?.name}</span> | MODULE INFORMATION</h4>


                                    <div className="mb-3">
                                        <h5>Module Name:</h5>
                                        <p>{module.name}</p>
                                    </div>

                                    <div className="mb-3">
                                        <h5>Assignments ({assignmentList.length || 0})</h5>
                                        <Link to={`/list-assignment/${module.id}`} className='text-success'>
                                            View All
                                        </Link>
                                    </div>

                                    <div className="mb-3">
                                        <h5>Lessons ({lessonList.length || 0})</h5>
                                        <Link to={`/list-lesson/${module.id}`} className='text-success'>
                                            View All
                                        </Link>
                                    </div>

                                    <div className="mb-3">
                                        <h5>Quizzes ({quizList.length || 0})</h5>
                                        <Link to={`/list-quiz/${module.id}`} className='text-success'>
                                            View All
                                        </Link>
                                    </div>
                                </div> {/* end card-box*/}
                            </div> {/* end col*/}
                        </div>
                        {/* end row*/}
                    </div> {/* container */}
                </div>
                <Footer />
            </div>
            <style>
                {`
                    body, #wrapper {
                        height: 100%;
                        margin: 0;
                    }

                    #wrapper {
                        display: flex;
                        flex-direction: column;
                    }

                    .content-page {
                        flex: 1;
                        width: 85%;
                        text-align: left;
                    }
                `}
            </style>
        </>
    );
}

export default EditModule;
