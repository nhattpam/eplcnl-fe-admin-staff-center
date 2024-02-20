import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import courseService from '../../services/course.service';
import moduleService from '../../services/module.service';

const EditCourse = () => {

    // Define isAdmin and isStaff outside of the component
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const isStaff = sessionStorage.getItem('isStaff') === 'true';

    const staffId = localStorage.getItem('staffId');


    const [course, setCourse] = useState({
        name: "",
        description: "",
        code: "",
        imageUrl: "",
        stockPrice: "",
        rating: "",
        categoryId: "",
        tags: "",
        createdDate: "",
        updatedDate: "",
        modules: [],
        classModules: []
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const [moduleList, setModuleList] = useState([]);
    const [classModuleList, setClassModuleList] = useState([]);


    const { id } = useParams();

    useEffect(() => {
        if (id) {
            courseService
                .getCourseById(id)
                .then((res) => {
                    setCourse(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

    useEffect(() => {
        courseService
            .getAllModulesByCourse(id)
            .then((res) => {
                console.log(res.data);
                setModuleList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    useEffect(() => {
        courseService
            .getAllClassModulesByCourse(id)
            .then((res) => {
                console.log(res.data);
                setClassModuleList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);



    const handleEditModule = (moduleId) => {
        // Add logic to navigate to the module edit page with the moduleId
        navigate(`/edit-module/${moduleId}`);
    };


    const handleEditClassModule = (moduleId) => {
        // Add logic to navigate to the module edit page with the moduleId
        navigate(`/edit-class-module/${moduleId}`);
    };

    const submitCourse = (e) => {
        e.preventDefault();

        courseService
            .updateCourse(course.id, course)
            .then((res) => {
                if (course.isActive) {
                    // centerService.sendEmail(center.id);
                    navigate(`/list-course-active/${staffId}`);

                } else {
                    navigate(`/list-course-inactive/${staffId}`);
                }
            })
            .catch((error) => {
                console.log(error);
            });
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
                                    <h4 className="header-title">COURSE INFORMATION</h4>

                                    <form id="demo-form" data-parsley-validate onSubmit={(e) => submitCourse(e)}>
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <th>Course Name:</th>
                                                        <td>{course.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Code:</th>
                                                        <td>{course.code}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Price:</th>
                                                        <td><span className="badge label-table badge-success">{course.stockPrice}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Tags:</th>
                                                        <td>
                                                            <span className="badge label-table badge-warning">{course.tags}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="form-group">
                                            <label>Modules:</label>

                                            <ul className="list-group">
                                                {moduleList.map((module) => (
                                                    <li key={module.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {module.name}
                                                        <button
                                                            type="button"
                                                            className="btn btn-link text-dark"
                                                            onClick={() => handleEditModule(module.id)}
                                                        >
                                                            <i className="far fa-edit"></i>

                                                        </button>
                                                    </li>
                                                ))}

                                                {classModuleList.map((module) => (
                                                    <li key={module.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {module.startDate !== null ? module.startDate : "No start date"}
                                                        <button
                                                            type="button"
                                                            className="btn btn-link text-dark"
                                                            onClick={() => handleEditClassModule(module.id)}
                                                        >
                                                            <i className="far fa-edit"></i>

                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {(!course.isOnlineClass) && (
                                            <div className="form-group mb-2">
                                                <>
                                                    {moduleList.length === 0 && (
                                                        <p>No modules available.</p>
                                                    )}
                                                    {/* <Link
                                                        type="button"
                                                        className="btn btn-success mr-2"
                                                        to={`/tutor/courses/create/create-video-course/create-module/${course.id}`}
                                                    >
                                                        <i className="bi bi-plus"></i> Create new module
                                                    </Link> */}

                                                    {isStaff && (

                                                        <button
                                                            type="submit"
                                                            className="btn btn-success"
                                                        >
                                                            <i class="fa-solid fa-thumbs-up"></i> 
                                                        </button>
                                                    )}
                                                    {isStaff && (

                                                        <button
                                                            type="submit"
                                                            className="btn btn-danger ml-1"
                                                        >
                                                            <i class="fa-solid fa-thumbs-down"></i> 
                                                        </button>
                                                    )}
                                                    {isAdmin && (
                                                        <button
                                                            type="submit"
                                                            className="btn btn-danger"
                                                        >
                                                            <i class="fa-solid fa-trash-can"></i> 
                                                        </button>
                                                    )}
                                                </>


                                            </div>

                                        )}
                                        {(course.isOnlineClass) && (
                                            <div className="form-group mb-2">
                                                <>
                                                    {classModuleList.length === 0 && (
                                                        <p>No modules available.</p>
                                                    )}
                                                    {/* <Link
                                                        type="button"
                                                        className="btn btn-success mr-2"
                                                        to={`/tutor/courses/create/create-class-course/create-class-module/${course.id}`}
                                                    >
                                                        <i className="bi bi-plus"></i> Create new module
                                                    </Link> */}


                                                    {isStaff && (

                                                        <button
                                                            type="submit"
                                                            className="btn btn-success"
                                                            onClick={() => setCourse({ ...course, isActive: true })}

                                                        >
                                                            <i class="fa-solid fa-thumbs-up"></i>
                                                        </button>
                                                    )}
                                                    {isStaff && (

                                                        <button
                                                            type="submit"
                                                            className="btn btn-danger ml-1"
                                                            onClick={() => setCourse({ ...course, isActive: false })}
                                                        >
                                                            <i class="fa-solid fa-thumbs-down"></i>
                                                        </button>
                                                    )}
                                                    {/* {isAdmin && (
                                                        <button
                                                            type="submit"
                                                            className="btn btn-danger"
                                                        >
                                                            <i className="bi bi-x-lg"></i> Delete
                                                        </button>
                                                    )} */}
                                                </>


                                            </div>

                                        )}




                                    </form>
                                </div> {/* end card-box*/}
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
                `}
            </style>
        </>
    )
}

export default EditCourse;
