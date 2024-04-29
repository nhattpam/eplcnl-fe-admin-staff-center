import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moduleService from '../../services/module.service';
import classModuleService from '../../services/class-module.service';
import classLessonService from '../../services/class-lesson.service';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

const EditClassModule = () => {
    
    const [module, setModule] = useState({
        startDate: "",
        classHours: "",
        classLesson: ""
    });

    const [errors, setErrors] = useState({});
    const [classTopicList, setClassTopicList] = useState([]);

    const [msg, setMsg] = useState('');
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    console.log("STatus: " + storedLoginStatus)
    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }    const { moduleId } = useParams();

    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

    useEffect(() => {
        if (moduleId) {
            classModuleService
                .getModuleById(moduleId)
                .then((res) => {
                    setModule(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        }
    }, [moduleId]);

    useEffect(() => {
        if (module.classLesson?.id) {
            classLessonService
                .getAllClassTopicsByClassLesson(module.classLesson?.id)
                .then((res) => {
                    // console.log(res.data);
                    setClassTopicList(res.data);

                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }, [module.classLesson?.id]);

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
                                    <h4 className="header-title">COURSE - <span className='text-success'>{module.course?.name}</span>  | CLASS INFORMATION</h4>
                                    {loading && (
                                        <div className="loading-overlay">
                                            <div className="loading-spinner" />
                                        </div>
                                    )}
                                    <form id="demo-form" data-parsley-validate>
                                        <div className="form-group">
                                            <label htmlFor="name">Class Date: </label>
                                            <div>
                                                {module.startDate ? new Date(module.startDate).toLocaleDateString('en-US') : "No class time"}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <h5>Class Hours: </h5>
                                            <div>
                                                {module.classLesson?.classHours}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <h5>Class Url:</h5>
                                            <div>
                                                {module.classLesson?.classUrl}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <h5>Topics:</h5>
                                            <>
                                                <div className="table-responsive">
                                                    <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                        <thead className="thead-light">
                                                            <tr>
                                                                <th data-toggle="true">No.</th>
                                                                <th data-hide="phone, tablet">Name</th>
                                                                <th data-hide="phone, tablet">Description</th>
                                                                <th data-hide="phone, tablet">Created Date</th>
                                                                <th data-hide="phone, tablet">Updated Date</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {classTopicList.length > 0 && classTopicList.map((classTopic, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        {classTopic.name}
                                                                    </td>
                                                                    <td>
                                                                        {classTopic.description}
                                                                    </td>
                                                                    <td>
                                                                        {classTopic.createdDate}
                                                                    </td>
                                                                    <td>
                                                                        {classTopic.updatedDate}
                                                                    </td>
                                                                    <td>
                                                                        <Link to={`/edit-topic/${classTopic.id}`} className='text-secondary'>
                                                                            <i className="fa-regular fa-eye"></i>
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div> {/* end .table-responsive*/}
                                            </>


                                        </div>
                                        {
                                            classTopicList.length === 0 && (
                                                <p className='text-center'>No topics found.</p>
                                            )
                                        }
                                    </form>
                                </div> {/* end card-box*/}
                                <Link
                                    type="button"
                                    className="btn btn-black mr-2"
                                    to={`/edit-course/${module.courseId}`}
                                >
                                    <i class="fas fa-long-arrow-alt-left"></i> Back to Course Infomation
                                </Link>
                            </div> {/* end col*/}
                        </div>
                        {/* end row*/}
                    </div> {/* container */}
                </div>
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

                    .loading-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        backdrop-filter: blur(10px); /* Apply blur effect */
                        -webkit-backdrop-filter: blur(10px); /* For Safari */
                        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999; /* Ensure it's on top of other content */
                    }
                    
                    .loading-spinner {
                        border: 8px solid rgba(245, 141, 4, 0.1); /* Transparent border to create the circle */
                        border-top: 8px solid #f58d04; /* Orange color */
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        animation: spin 1s linear infinite; /* Rotate animation */
                    }
                    
                    @keyframes spin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                    
                    
                `}
            </style>
        </>
    );
}

export default EditClassModule;
