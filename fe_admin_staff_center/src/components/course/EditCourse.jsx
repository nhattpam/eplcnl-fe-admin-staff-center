import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import courseService from '../../services/course.service';
import moduleService from '../../services/module.service';
import ReactQuill from 'react-quill';

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
        note: "",
        modules: [],
        classModules: []
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // State variable for modal visibility

    const [moduleList, setModuleList] = useState([]);
    const [classModuleList, setClassModuleList] = useState([]);
    const [isDoneOrNot, setIsDoneOrNot] = useState(false);


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

    const handleNoteChange = (value) => {
        setCourse({ ...course, note: value });
    };


    const handleThumbDownClick = () => {
        setShowModal(true); // Show modal when thumb-down button is clicked
        setCourse({ ...course, isActive: false }); // Set isActive to false
    };


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


    //list feedbacks
    const [feedbackList, setFeedbackList] = useState([]);
    useEffect(() => {
        if (id) {
            courseService.getAllFeedbacksByCourse(id)
                .then((res) => {
                    setFeedbackList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

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
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-2" data-page-size={7}>
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
                                                        <td><span className="badge label-table badge-success">${course.stockPrice}</span></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Tags:</th>
                                                        <td>
                                                            <span className="badge label-table badge-warning">{course.tags}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Tutor:</th>
                                                        <td>
                                                             {course.tutor?.account?.fullName}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="form-group">
                                            <label>Modules:</label>
                                            {!course.isOnlineClass && (
                                                <>
                                                    <div className="table-responsive">
                                                        <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                            <thead className="thead-light">
                                                                <tr>
                                                                    <th data-toggle="true">No.</th>
                                                                    <th data-hide="phone, tablet">Name</th>
                                                                    <th data-hide="phone, tablet">Created Date</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {moduleList.length > 0 && moduleList.map((module, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{module.name}</td>
                                                                        <td>{module.createdDate}</td>
                                                                        <td>
                                                                            <Link to={`/edit-module/${module.id}`} className='text-secondary'>
                                                                                <i className="fa-regular fa-eye"></i>
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div> {/* end .table-responsive*/}
                                                </>
                                            )}
                                            {course.isOnlineClass && (
                                                <>
                                                    <div className="table-responsive">
                                                        <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                            <thead className="thead-light">
                                                                <tr>
                                                                    <th data-toggle="true">No.</th>
                                                                    <th data-hide="phone, tablet">Class Date</th>
                                                                    <th data-hide="phone, tablet">Created Date</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {classModuleList.length > 0 && classModuleList.map((module, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>
                                                                            {module.startDate ? new Date(module.startDate).toLocaleDateString('en-US') : "No class time"}
                                                                        </td>                                                                        <td>{module.createdDate}</td>
                                                                        <td>
                                                                            <Link to={`/edit-class-module/${module.id}`} className='text-secondary'>
                                                                                <i className="fa-regular fa-eye"></i>
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div> {/* end .table-responsive*/}
                                                </>
                                            )}
                                        </div>


                                        {(!course.isOnlineClass) && (
                                            <div className="form-group mb-2">
                                                <>
                                                    {moduleList.length === 0 && (
                                                        <p className='text-center'>No modules available.</p>
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
                                                            onClick={() => setCourse({ ...course, isActive: true })}
                                                            style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                        >
                                                            <i class="fa-solid fa-thumbs-up"></i>
                                                        </button>
                                                    )}
                                                    {isStaff && (


                                                        <button type="button" className="btn btn-danger ml-1" onClick={handleThumbDownClick} style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                                            <i class="fa-solid fa-thumbs-down"></i>
                                                        </button>
                                                    )}

                                                    {/* {isStaff && (
                                                        <button
                                                            type="submit"
                                                            className="btn btn-danger ml-1"
                                                        >
                                                            <i class="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    )} */}
                                                </>


                                            </div>

                                        )}
                                        {(course.isOnlineClass) && (
                                            <div className="form-group mb-2">
                                                <>
                                                    {classModuleList.length === 0 && (
                                                        <p className='text-center'>No modules available.</p>
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
                                                            style={{ borderRadius: '50px', padding: `8px 25px` }}

                                                        >
                                                            <i class="fa-solid fa-thumbs-up"></i>
                                                        </button>
                                                    )}
                                                    {isStaff && (

                                                        <button type="button" className="btn btn-danger ml-1" onClick={handleThumbDownClick} style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                                            
                                                            <i class="fa-solid fa-thumbs-down"></i>
                                                        </button>
                                                    )}
                                                    {/* {isStaff && (
                                                        <button
                                                            type="submit"
                                                            className="btn btn-danger ml-1"
                                                        >
                                                            <i class="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    )} */}
                                                </>


                                            </div>

                                        )}




                                    </form>
                                    <div className="form-group">
                                        <>

                                            <label>Feedbacks:</label>
                                            {
                                                feedbackList.length > 0 && feedbackList.map((feedback, index) => (
                                                    <>
                                                        {/* <div className="mt-3 d-flex flex-row align-items-center p-3 form-color"> <img src="https://i.imgur.com/zQZSWrt.jpg" width={50} className="rounded-circle mr-2" /> <input type="text" className="form-control" placeholder="Enter your comment..." /> </div> */}
                                                        < div className="mt-2" >
                                                            <div className="d-flex flex-row p-3"> <img src={feedback.learner.account.imageUrl} width={40} height={40} className="rounded-circle mr-3" />
                                                                <div className="w-100">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex flex-row align-items-center"> <span className="mr-2" style={{ fontWeight: 'bold' }}>{feedback.learner.account.fullName}</span> <small className="c-badge">Top Comment</small> </div> <small>{feedback.createdDate}</small>
                                                                    </div>
                                                                    <p className="text-justify comment-text mb-0" dangerouslySetInnerHTML={{ __html: feedback.feedbackContent }}></p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </>

                                                ))
                                            }
                                            {
                                                feedbackList.length === 0 && (
                                                    <p className='text-center'>No feedbacks yet.</p>
                                                )
                                            }




                                        </>
                                    </div>
                                    {showModal && (
                                        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Provide Note</h5>
                                                        <button type="button" className="close" onClick={() => setShowModal(false)}>
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <ReactQuill
                                                            value={course.note}
                                                            onChange={handleNoteChange}
                                                            modules={{
                                                                toolbar: [
                                                                    [{ header: [1, 2, false] }],
                                                                    ['bold', 'italic', 'underline', 'strike'],
                                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                                                                    [{ 'direction': 'rtl' }],
                                                                    [{ 'align': [] }],
                                                                    ['link', 'image', 'video'],
                                                                    ['code-block'],
                                                                    [{ 'color': [] }, { 'background': [] }],
                                                                    ['clean']
                                                                ]
                                                            }}
                                                            theme="snow"
                                                        />
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-dark" onClick={() => setShowModal(false)} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                                        <button type="button" className="btn btn-danger" onClick={(e) => submitCourse(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}>Submit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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