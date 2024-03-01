import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moduleService from '../../services/module.service';
import ReactPaginate from 'react-paginate';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

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

    //paginate
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [lessonsPerPage] = useState(2);

    const [searchTerm2, setSearchTerm2] = useState('');
    const [currentPage2, setCurrentPage2] = useState(0);
    const [assignmentsPerPage] = useState(2);

    const [searchTerm3, setSearchTerm3] = useState('');
    const [currentPage3, setCurrentPage3] = useState(0);
    const [quizsPerPage] = useState(2);


    const filteredLessons = lessonList
        .filter((lesson) => {
            return (
                lesson.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredLessons.length / lessonsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * lessonsPerPage;
    const currentLessons = filteredLessons.slice(offset, offset + lessonsPerPage);

    const filteredAssignments = assignmentList
        .filter((assignment) => {
            return (
                assignment.id.toString().toLowerCase().includes(searchTerm2.toLowerCase())

            );
        });

    const pageCount2 = Math.ceil(filteredAssignments.length / assignmentsPerPage);

    const handlePageClick2 = (data) => {
        setCurrentPage2(data.selected);
    };

    const offset2 = currentPage2 * assignmentsPerPage;
    const currentAssignments = filteredAssignments.slice(offset2, offset2 + assignmentsPerPage);



    const filteredQuizs = quizList
        .filter((quiz) => {
            return (
                quiz.id.toString().toLowerCase().includes(searchTerm3.toLowerCase())

            );
        });

    const pageCount3 = Math.ceil(filteredQuizs.length / quizsPerPage);

    const handlePageClick3 = (data) => {
        setCurrentPage3(data.selected);
    };

    const offset3 = currentPage3 * quizsPerPage;
    const currentQuizs = filteredQuizs.slice(offset3, offset3 + quizsPerPage);
    //paginate

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
                                        <h5>Module Name: {module.name}</h5>
                                    </div>


                                    <div className="row">
                                        <div className="col-12">
                                            <h5>List of Lessons &nbsp;

                                            </h5>
                                            <div className="table-responsive">
                                                <table id="demo-foo-filtering" className="table table-bordered toggle-circle mb-0" data-page-size={7}>
                                                    <thead>
                                                        <tr>
                                                            <th data-toggle="true">No.</th>
                                                            <th data-toggle="true">Lesson Name</th>
                                                            {/* <th>Video Url</th> */}
                                                            <th data-hide="phone">Created Date</th>
                                                            <th data-hide="phone, tablet">Updated Date</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentLessons.map((lesson, index) => (
                                                            <tr key={lesson.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{lesson.name}</td>
                                                                {/* <td>{lesson.videoUrl}</td> */}
                                                                <td>{lesson.createdDate}</td>
                                                                <td>{lesson.updatedDate}</td>
                                                                <td>
                                                                    <Link to={`/tutor/courses/edit-lesson/${lesson.id}`} className='text-dark'>
                                                                        <i class="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td>

                                                            </tr>
                                                        ))}
                                                    </tbody>

                                                </table>
                                            </div> {/* end .table-responsive*/}
                                        </div>
                                        <div className='container-fluid'>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                <ReactPaginate
                                                    previousLabel={<AiFillCaretLeft style={{ color: "#000", fontSize: "14px" }} />}
                                                    nextLabel={<AiFillCaretRight style={{ color: "#000", fontSize: "14px" }} />}
                                                    breakLabel={'...'}
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
                                        <div className="col-12">
                                            <h5>List of Assignments &nbsp;

                                            </h5>
                                            <div className="table-responsive">

                                                <table id="demo-foo-filtering" className="table table-bordered toggle-circle mb-0" data-page-size={7}>
                                                    <thead>
                                                        <tr>
                                                            <th>No.</th>
                                                            <th>Time</th>
                                                            <th>Question</th>
                                                            <th data-hide="phone">Created Date</th>
                                                            <th data-hide="phone, tablet">Updated Date</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentAssignments.map((assignment, index) => (
                                                            <tr key={assignment.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{assignment.deadline}</td>
                                                                <td className="truncate-text">{assignment.questionText}</td>
                                                                <td>{assignment.createdDate}</td>
                                                                <td>{assignment.updatedDate}</td>
                                                                <td>
                                                                    <Link to={`/edit-assignment/${assignment.id}`} className='text-secondary'>
                                                                        <i class="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>

                                                </table>
                                            </div> {/* end .table-responsive*/}
                                        </div>
                                        <div className='container-fluid'>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                <ReactPaginate
                                                    previousLabel={<AiFillCaretLeft style={{ color: "#000", fontSize: "14px" }} />}
                                                    nextLabel={<AiFillCaretRight style={{ color: "#000", fontSize: "14px" }} />}
                                                    breakLabel={'...'}
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
                                        <div className="col-12">
                                            <h5>List of Quizzes &nbsp;

                                            </h5>
                                            <div className="table-responsive">
                                                <table id="demo-foo-filtering" className="table table-bordered toggle-circle mb-0" data-page-size={7}>
                                                    <thead>
                                                        <tr>
                                                            <th data-toggle="true">No.</th>
                                                            <th data-toggle="true">Quiz Name</th>
                                                            <th>Grade to pass</th>
                                                            <th>Times</th>
                                                            <th data-hide="phone">Created Date</th>
                                                            <th data-hide="phone, tablet">Updated Date</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentQuizs.map((quiz, index) => (
                                                            <tr key={quiz.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{quiz.name}</td>
                                                                <td>{quiz.gradeToPass}</td>
                                                                <td>{quiz.deadline}</td>
                                                                <td>{quiz.createdDate}</td>
                                                                <td>{quiz.updatedDate}</td>
                                                                <td>
                                                                    <Link to={`/edit-quiz/${quiz.id}`} className='text-secondary'>
                                                                        <i class="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>

                                                </table>
                                            </div> {/* end .table-responsive*/}
                                        </div>
                                        <div className='container-fluid'>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                <ReactPaginate
                                                    previousLabel={<AiFillCaretLeft style={{ color: "#000", fontSize: "14px" }} />}
                                                    nextLabel={<AiFillCaretRight style={{ color: "#000", fontSize: "14px" }} />}
                                                    breakLabel={'...'}
                                                    breakClassName={'page-item'}
                                                    breakLinkClassName={'page-link'}
                                                    pageCount={pageCount3}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={5}
                                                    onPageChange={handlePageClick3}
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

                                    </div>
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

                    .page-item.active .page-link{
                        background-color: #20c997;
                        border-color: #20c997;
                    }
                `}
            </style>
        </>
    );
}

export default EditModule;
