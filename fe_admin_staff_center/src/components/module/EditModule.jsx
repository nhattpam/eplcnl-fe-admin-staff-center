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
                                    <h4 className="header-title">Course {module.course?.name} | Module Information</h4>

                                    <form id="demo-form" data-parsley-validate>
                                        <div className="form-group">
                                            <label htmlFor="name">Module Name * :</label>
                                            <input type="text" className="form-control" name="name" id="name" value={module.name} readOnly />
                                        </div>

                                        <div className="form-group">
                                            <h5>Assignments: {module.assignments?.length || 0}</h5>
                                            <ul>
                                                <Link to={`/list-assignment/${module.id}`}>
                                                    View All
                                                </Link>
                                            </ul>
                                        </div>

                                        <div className="form-group">
                                            <h5>Lessons: {module.lessons?.length || 0}</h5>
                                            <ul>
                                                <Link to={`/list-lesson/${module.id}`}>
                                                    View All
                                                </Link>
                                            </ul>
                                        </div>

                                        <div className="form-group">
                                            <h5>Quizzes: {module.quizzes?.length || 0}</h5>
                                            <ul>
                                                <Link to={`/list-quiz/${module.id}`}>
                                                    View All
                                                </Link>
                                            </ul>
                                        </div>

                                        <div className="form-group mb-0">
                                            <button
                                                type="submit"
                                                className="btn btn-danger"
                                            >
                                                <i className="bi bi-x-lg"></i> Request to delete
                                            </button>
                                        </div>
                                    </form>
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
