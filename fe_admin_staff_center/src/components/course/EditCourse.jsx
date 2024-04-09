import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import courseService from '../../services/course.service';
import moduleService from '../../services/module.service';
import ReactQuill from 'react-quill';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
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

    //enrolled learners:
    const [enrollmentList, setEnrollmentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [enrollmentsPerPage] = useState(5);
    useEffect(() => {
        courseService
            .getAllEnrollmentsByCourse(id)
            .then((res) => {
                const notRefundEnrollments = res.data.filter(enrollment => enrollment.refundStatus === false);

                console.log(res.data);
                setEnrollmentList(notRefundEnrollments);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const filteredEnrollments = enrollmentList
        .filter((enrollment) => {
            return (
                enrollment.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    const pageCount = Math.ceil(filteredEnrollments.length / enrollmentsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * enrollmentsPerPage;
    const currentEnrollments = filteredEnrollments.slice(offset, offset + enrollmentsPerPage);

    //refund learners:
    const [enrollmentList2, setEnrollmentList2] = useState([]);
    const [searchTerm2, setSearchTerm2] = useState('');
    const [currentPage2, setCurrentPage2] = useState(0);
    const [enrollmentsPerPage2] = useState(5);
    useEffect(() => {
        courseService
            .getAllEnrollmentsByCourse(id)
            .then((res) => {
                const notRefundEnrollments = res.data.filter(enrollment => enrollment.refundStatus === true);

                console.log(res.data);
                setEnrollmentList2(notRefundEnrollments);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const filteredEnrollments2 = enrollmentList2
        .filter((enrollment) => {
            return (
                enrollment.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    const pageCount2 = Math.ceil(filteredEnrollments2.length / enrollmentsPerPage2);

    const handlePageClick2 = (data) => {
        setCurrentPage2(data.selected);
    };

    const offset2 = currentPage2 * enrollmentsPerPage2;
    const currentEnrollments2 = filteredEnrollments2.slice(offset2, offset2 + enrollmentsPerPage2);

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
                                            <h5>Modules:</h5>
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

                                            <h5>Feedbacks:</h5>
                                            {
                                                feedbackList.length > 0 && feedbackList.map((feedback, index) => (
                                                    <>
                                                        {/* <div className="mt-3 d-flex flex-row align-items-center p-3 form-color"> <img src="https://i.imgur.com/zQZSWrt.jpg" width={50} className="rounded-circle mr-2" /> <input type="text" className="form-control" placeholder="Enter your comment..." /> </div> */}
                                                        < div className="mt-2" >
                                                            <div className="d-flex flex-row p-3"> <img src={feedback.learner?.account?.imageUrl} width={40} height={40} className="rounded-circle mr-3" />
                                                                <div className="w-100">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="d-flex flex-row align-items-center"> <span className="mr-2" style={{ fontWeight: 'bold' }}>{feedback.learner?.account?.fullName}</span> <small className="c-badge">Top Comment</small> </div> <small>{feedback.createdDate}</small>
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
                                    <div className="form-group mt-4">
                                        <h5>Enrolled Learners:</h5>

                                        <div className="table-responsive text-center">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th data-toggle="true">No.</th>
                                                        <th data-toggle="true">Image</th>
                                                        <th data-toggle="true">Full Name</th>
                                                        <th data-toggle="true">Phone</th>
                                                        <th data-hide="phone">Gender</th>
                                                        <th data-hide="phone, tablet">DOB</th>
                                                        <th data-hide="phone, tablet">Status</th>
                                                        {/* <th>Action</th> */}
                                                        {/* <th>Courses</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentEnrollments.length > 0 && currentEnrollments.map((enrollment, index) => (
                                                            <tr key={enrollment.id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <img src={enrollment.transaction?.learner?.account?.imageUrl} style={{ height: '70px', width: '50px' }}>

                                                                    </img>
                                                                </td>
                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.fullName ? enrollment.transaction?.learner?.account?.fullName : 'Unknown Name'}</td>
                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.phoneNumber ? enrollment.transaction?.learner?.account?.phoneNumber : 'Unknown Phone Number'}</td>
                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.gender !== undefined ? (enrollment.transaction?.learner?.account?.gender ? 'Male' : 'Female') : 'Unknown Gender'}</td>
                                                                <td>
                                                                    {enrollment.transaction?.learner?.account?.dateOfBirth && typeof enrollment.transaction.learner.account.dateOfBirth === 'string' ?
                                                                        enrollment.transaction.learner.account.dateOfBirth.substring(0, 10) :
                                                                        'Unknown DOB'}
                                                                </td>
                                                                <td>
                                                                    {enrollment.transaction?.learner?.account?.isActive ? (
                                                                        <span className="badge label-table badge-success">Active</span>
                                                                    ) : (
                                                                        <span className="badge label-table badge-danger">Inactive</span>
                                                                    )}
                                                                </td>
                                                                {/* <td>
                                                                    <Link to={`/edit-learner/${enrollment.transaction?.learner?.account?.id}`} className='text-secondary'>
                                                                        <i className="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td> */}
                                                                {/* <td>
                                                                            <Link to={`/list-course-by-tutor/${tutor.id}`} className='text-dark'>
                                                                                <i class="ti-more-alt"></i>
                                                                            </Link>
                                                                        </td> */}
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>
                                            </table>


                                        </div>
                                    </div>
                                    {
                                        enrollmentList.length === 0 && (
                                            <p className='text-center'>No enrollments yet.</p>
                                        )
                                    }
                                    {/* Pagination */}
                                    <div className='container-fluid'>
                                        {/* Pagination */}
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <ReactPaginate
                                                previousLabel={
                                                    <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                                        <AiFillCaretLeft />
                                                    </IconContext.Provider>
                                                }
                                                nextLabel={
                                                    <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                                        <AiFillCaretRight />
                                                    </IconContext.Provider>
                                                } breakLabel={'...'}
                                                breakClassName={'page-item'}
                                                breakLinkClassName={'page-link'}
                                                pageCount={pageCount}
                                                marginPagesDisplayed={2}
                                                pageRangeDisplayed={5}
                                                onPageChange={handlePageClick}
                                                containerClassName={'pagination'}
                                                activeClassName={'active'}
                                                previousClassName={'page-item'}
                                                nextClassName={'page-item'}
                                                pageClassName={'page-item'}
                                                previousLinkClassName={'page-link'}
                                                nextLinkClassName={'page-link'}
                                                pageLinkClassName={'page-link'}
                                            />
                                        </div>

                                    </div>

                                    <div className="form-group mt-4">
                                        <h5>Refunded Learners:</h5>

                                        <div className="table-responsive text-center">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th data-toggle="true">No.</th>
                                                        <th data-toggle="true">Image</th>
                                                        <th data-toggle="true">Full Name</th>
                                                        <th data-toggle="true">Phone</th>
                                                        <th data-hide="phone">Gender</th>
                                                        <th data-hide="phone, tablet">DOB</th>
                                                        <th data-hide="phone, tablet">Status</th>
                                                        {/* <th>Action</th> */}
                                                        {/* <th>Courses</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentEnrollments2.length > 0 && currentEnrollments2.map((enrollment, index) => (
                                                            <tr key={enrollment.id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <img src={enrollment.transaction?.learner?.account?.imageUrl} style={{ height: '70px', width: '50px' }}>

                                                                    </img>
                                                                </td>
                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.fullName ? enrollment.transaction?.learner?.account?.fullName : 'Unknown Name'}</td>
                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.phoneNumber ? enrollment.transaction?.learner?.account?.phoneNumber : 'Unknown Phone Number'}</td>
                                                                <td>{enrollment.transaction?.learner?.account && enrollment.transaction?.learner?.account?.gender !== undefined ? (enrollment.transaction?.learner?.account?.gender ? 'Male' : 'Female') : 'Unknown Gender'}</td>
                                                                <td>
                                                                    {enrollment.transaction?.learner?.account?.dateOfBirth && typeof enrollment.transaction.learner.account.dateOfBirth === 'string' ?
                                                                        enrollment.transaction.learner.account.dateOfBirth.substring(0, 10) :
                                                                        'Unknown DOB'}
                                                                </td>
                                                                <td>
                                                                    {enrollment.transaction?.learner?.account?.isActive ? (
                                                                        <span className="badge label-table badge-success">Active</span>
                                                                    ) : (
                                                                        <span className="badge label-table badge-danger">Inactive</span>
                                                                    )}
                                                                </td>
                                                                {/* <td>
                                                                    <Link to={`/edit-learner/${enrollment.transaction?.learner?.account?.id}`} className='text-secondary'>
                                                                        <i className="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td> */}
                                                                {/* <td>
                                                                            <Link to={`/list-course-by-tutor/${tutor.id}`} className='text-dark'>
                                                                                <i class="ti-more-alt"></i>
                                                                            </Link>
                                                                        </td> */}
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>
                                            </table>


                                        </div>
                                    </div>
                                    {
                                        enrollmentList2.length === 0 && (
                                            <p className='text-center'>No refunds yet.</p>
                                        )
                                    }
                                    {/* Pagination */}
                                    <div className='container-fluid'>
                                        {/* Pagination */}
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <ReactPaginate
                                                previousLabel={
                                                    <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                                        <AiFillCaretLeft />
                                                    </IconContext.Provider>
                                                }
                                                nextLabel={
                                                    <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                                        <AiFillCaretRight />
                                                    </IconContext.Provider>
                                                } breakLabel={'...'}
                                                breakClassName={'page-item'}
                                                breakLinkClassName={'page-link'}
                                                pageCount={pageCount2}
                                                marginPagesDisplayed={2}
                                                pageRangeDisplayed={5}
                                                onPageChange={handlePageClick2}
                                                containerClassName={'pagination'}
                                                activeClassName={'active'}
                                                previousClassName={'page-item'}
                                                nextClassName={'page-item'}
                                                pageClassName={'page-item'}
                                                previousLinkClassName={'page-link'}
                                                nextLinkClassName={'page-link'}
                                                pageLinkClassName={'page-link'}
                                            />
                                        </div>

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
                    .page-item.active .page-link{
                        background-color: #20c997;
                        border-color: #20c997;
                    }
                `}
            </style>
        </>
    )
}

export default EditCourse;