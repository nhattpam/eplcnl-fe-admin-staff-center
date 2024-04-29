import { React, useState, useEffect, useRef } from "react";
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import accountService from '../../services/account.service';
import staffService from '../../services/staff.service';
import tutorService from '../../services/tutor.service';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import ReactQuill from 'react-quill';
import { Chart, PieController, ArcElement, registerables } from "chart.js";

const EditTutor = () => {

    Chart.register(PieController, ArcElement);
    Chart.register(...registerables);
    const pieChartRef = useRef(null);
    const areaChartRef = useRef(null);

    // Define isAdmin and isStaff outside of the component
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const isStaff = sessionStorage.getItem('isStaff') === 'true';

    const [courseList, setCourseList] = useState([]);


    const [account, setAccount] = useState({
        id: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        imageUrl: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        isActive: "",
        createdDate: "",
        isDelete: "",
        note: ""
    });

    const [tutor, setTutor] = useState({
        staffId: "",
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    console.log("STatus: " + storedLoginStatus)
    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }
    
    const [showModal, setShowModal] = useState(false); // State variable for modal visibility
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [coursesPerPage] = useState(2);

    const [staffList, setStaffList] = useState([]);
    const [salaryList, setSalaryList] = useState([]);


    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING


    useEffect(() => {
        staffService
            .getAllStaff()
            .then((res) => {

                setStaffList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const { id } = useParams();

    useEffect(() => {
        if (id) {
            accountService
                .getAccountById(id)
                .then((res) => {
                    setAccount(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
            accountService
                .getAllSalariesByAccount(id)
                .then((res) => {
                    setSalaryList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

    //get tutor by accountId
    useEffect(() => {
        if (id) {
            accountService
                .getTutorByAccountId(id)
                .then((res) => {
                    setTutor(res.data);
                    //list course by tutors
                    tutorService
                        .getAllCoursesByTutor(res.data.id)
                        .then((res) => {
                            // Filter the courses where isActive is true
                            console.log(res.data);

                            setCourseList(res.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setTutor({ ...tutor, [name]: value });
    };

    const submitAccount = (e) => {
        e.preventDefault();

        accountService
            .updateAccount(account.id, account)
            .then((res) => {
                if (account.isActive) {
                    // centerService.sendEmail(center.id);
                    //assign staff to tutor
                    tutorService.updateTutor(tutor.id, tutor);
                    if (account.isActive === false) {
                        accountService.sendMailBanAccount(account.id);
                    }
                }
                navigate("/list-tutor/");
            })
            .catch((error) => {
                console.log(error);
            });
    };



    const filteredCourses = courseList
        .filter((course) => {
            return (
                course.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    const pageCount = Math.ceil(filteredCourses.length / coursesPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * coursesPerPage;
    const currentCourses = filteredCourses.slice(offset, offset + coursesPerPage);


    //ban account
    const handleNoteChange = (value) => {
        setAccount({ ...account, note: value });
    };


    const handleDeleteClick = () => {
        setShowModal(true); // Show modal when thumb-down button is clicked
        setAccount({ ...account, isActive: false, isDeleted: true }); // Set isActive to false
    };

    const handleActiveClick = () => {
        setAccount({ ...account, isActive: true, isDeleted: false }); // Set isActive to false
    };

    //paper work tutor
    const [showQualificationModal, setShowQualificationModal] = useState(false);
    //qualification
    const openQualificationModal = () => {
        setShowQualificationModal(true);

    };

    const closeQualificationModal = () => {
        setShowQualificationModal(false);
    };
    const [paperWorkList, setPaperWorkList] = useState([]);
    useEffect(() => {
        tutorService
            .getAllPaperWorksByTutor(tutor.id)
            .then((res) => {
                setPaperWorkList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [tutor.id]);


    //SALARY
    const [showSalaryModal, setShowSalaryModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const openSalaryModal = () => {
        setShowSalaryModal(true);
    };

    const closeSalaryModal = () => {
        setShowSalaryModal(false);
    };

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const renderSalaryTable = () => {
        // Filter salary list for the selected year
        const filteredSalaries = salaryList.filter(salary => salary.year === selectedYear);

        return (
            <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                <thead className="thead-light">
                    <tr>
                        {months.map((month, index) => (
                            <th key={index}>{month}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {months.map((month, index) => {
                            // Find the salary for the current month
                            const salaryForMonth = filteredSalaries.find(salary => salary.month === index + 1);
                            return (
                                <td key={index}>
                                    {salaryForMonth ? `$${salaryForMonth.amount.toFixed(2)}` : '-'}
                                </td>
                            );
                        })}
                    </tr>
                </tbody>
            </table>
        );
    };


    //COMPARE
    useEffect(() => {
        // Call createAreaChart whenever selectedYear changes or modal is shown
        createAreaChart();
    }, [selectedYear, renderSalaryTable]);



    const createAreaChart = () => {
        if (areaChartRef.current) {
            const areaChartCanvas = areaChartRef.current.getContext("2d");

            if (areaChartRef.current.chart) {
                areaChartRef.current.chart.destroy();
            }

            // Filter salary data for the selected year
            const filteredSalaries = salaryList.filter(salary => salary.year === selectedYear);

            // Extract salary for each month
            const salaryByMonth = Array.from({ length: 12 }, (_, index) => {
                const salaryForMonth = filteredSalaries.find(salary => salary.month === index + 1);
                return salaryForMonth ? salaryForMonth.amount : 0;
            });

            const data = {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
                datasets: [
                    {
                        label: "Income",
                        data: salaryByMonth, // Use salary data for each month
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 2,
                        pointBackgroundColor: "rgba(54, 162, 235, 1)",
                        pointBorderColor: "#fff",
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    },
                ],
            };

            const options = {
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            borderWidth: 1,
                            borderDash: [2],
                            borderDashOffset: [2],
                            drawBorder: false,
                            color: "rgba(0, 0, 0, 0.05)",
                            zeroLineColor: "rgba(0, 0, 0, 0.1)",
                        },
                        ticks: {
                            callback: (value) => {
                                if (value >= 1000) {
                                    return `$${value / 1000}k`;
                                }
                                return `$${value}`;
                            },
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label;
                                const value = context.formattedValue;
                                return `${label}: $${value}`;
                            },
                        },
                    },
                },
            };

            areaChartRef.current.chart = new Chart(areaChartCanvas, {
                type: "line",
                data: data,
                options: options,
            });
        }

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
                                    <h4 className="header-title">TUTOR INFORMATION</h4>
                                    {loading && (
                                        <div className="loading-overlay">
                                            <div className="loading-spinner" />
                                        </div>
                                    )}
                                    <form id="demo-form" data-parsley-validate onSubmit={(e) => submitAccount(e)}>
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div className="table-responsive">
                                                    <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                        <tbody>
                                                            <tr>
                                                                <th>Tutor Name:</th>
                                                                <td>{account.fullName}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Email:</th>
                                                                <td>{account.email}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Phone Number:</th>
                                                                <td>{account && account.phoneNumber ? account.phoneNumber : 'Unknown Phone Number'}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Date Of Birth:</th>
                                                                <td>{account && account.dateOfBirth ? account.dateOfBirth.substring(0, 10) : 'Unknown DOB'}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Gender:</th>
                                                                <td>
                                                                    {account.gender ? (
                                                                        <span className="badge label-table badge-success">Male</span>
                                                                    ) : (
                                                                        <span className="badge label-table badge-danger">Female</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Status:</th>
                                                                <td>
                                                                    {account.isActive ? (
                                                                        <span className="badge label-table badge-success">Active</span>
                                                                    ) : (
                                                                        <span className="badge label-table badge-danger">Inactive</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Note:</th>
                                                                <td dangerouslySetInnerHTML={{ __html: account.note }} />
                                                            </tr>
                                                            <tr>
                                                                <th>Qualifications:</th>
                                                                <td>
                                                                    <button type="button" onClick={openQualificationModal}> <i class="fas fa-folder-open"> </i></button>
                                                                </td>
                                                            </tr>
                                                        </tbody>

                                                    </table>
                                                </div>
                                            </div>
                                            {
                                                isAdmin && (
                                                    <div className="col-md-4">
                                                        <div className="form-group mb-0">
                                                            <button
                                                                type="submit"
                                                                className="btn btn-success " onClick={handleActiveClick}
                                                                style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                            >
                                                                <i class="fas fa-thumbs-up"></i>
                                                            </button>



                                                            <button
                                                                type="button"
                                                                className="btn btn-danger ml-1" onClick={handleDeleteClick}
                                                                style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                            >
                                                                <i class="fa-solid fa-user-xmark"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            }



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
                                                                value={account.note}
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
                                                            <button type="button" className="btn btn-dark" style={{ color: '#fff', borderRadius: '50px', padding: `8px 25px` }} onClick={() => setShowModal(false)}>Close</button>
                                                            <button type="button" className="btn btn-danger" style={{ color: '#fff', borderRadius: '50px', padding: `8px 25px` }} onClick={(e) => submitAccount(e)}>Disable</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {showQualificationModal && (
                                            <>
                                                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                                    <div className="modal-dialog modal-lg modal-dialog-centered " role="document"> {/* Added modal-dialog-centered class */}

                                                        <div className="modal-content">
                                                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}
                                                                <div>
                                                                    <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                                        <thead className="thead-light">
                                                                            <tr>
                                                                                <th scope="col">#</th>
                                                                                <th scope="col">Type</th>
                                                                                <th scope="col">Url</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {paperWorkList.length > 0 && paperWorkList.map((paperWork, index) => (

                                                                                <tr>
                                                                                    <th scope="row">{index + 1}</th>
                                                                                    <td>{paperWork.paperWorkType?.name}</td>
                                                                                    <td className='text-truncate' style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                                        <a href={paperWork.paperWorkUrl} className="text-success" target="_blank" rel="noopener noreferrer" >View</a>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}


                                                                        </tbody>
                                                                    </table>

                                                                </div>
                                                                {
                                                                    paperWorkList.length === 0 && (
                                                                        <p className='text-center mt-3'>No paper works.</p>
                                                                    )
                                                                }
                                                            </div>

                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-dark" onClick={closeQualificationModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>
                                            </>
                                        )
                                        }

                                        {isAdmin && (
                                            <div className="form-group">
                                                <label htmlFor="staffId">Managed By *:</label>
                                                <select
                                                    className="form-control"
                                                    id="staffId"
                                                    name="staffId"
                                                    value={tutor.staffId}
                                                    onChange={handleChange}
                                                    style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                >
                                                    <option value="">Select Staff</option>
                                                    {staffList.map((staff) => (
                                                        <option key={staff.id} value={staff.id}>
                                                            {staff.account ? staff.account?.fullName : 'Unknown Name'}
                                                        </option>
                                                    ))}

                                                </select>
                                            </div>
                                        )}


                                        <div className="form-group">
                                            <label>Created Courses:</label>

                                            <div className="table-responsive">
                                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th data-toggle="true">No.</th>
                                                            <th data-toggle="true">Image</th>
                                                            <th data-toggle="true">Code</th>
                                                            <th data-toggle="true">Name</th>
                                                            <th data-hide="phone">Price</th>
                                                            <th data-hide="phone, tablet">Rating</th>
                                                            <th data-hide="phone, tablet">Tags</th>
                                                            <th data-hide="phone, tablet">Category</th>
                                                            <th data-hide="phone, tablet">Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            currentCourses.length > 0 && currentCourses.map((cus, index) => (

                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        <img src={cus.imageUrl} style={{ height: '70px', width: '100px' }}>

                                                                        </img>
                                                                    </td>
                                                                    <td>{cus.code}</td>
                                                                    <td>{cus.name}</td>
                                                                    <td>{cus.stockPrice}</td>
                                                                    <td>{cus.rating}</td>
                                                                    <td>#{cus.tags}</td>
                                                                    <td>{cus.category?.name}</td>
                                                                    <td>
                                                                        {cus.isActive ? (
                                                                            <span className="badge label-table badge-success">Active</span>
                                                                        ) : (
                                                                            <span className="badge label-table badge-danger">Inactive</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <Link to={`/edit-course/${cus.id}`} className='text-secondary'>
                                                                            <i class="fa-regular fa-eye"></i>
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }

                                                    </tbody>

                                                </table>
                                            </div> {/* end .table-responsive*/}
                                        </div>


                                    </form>
                                    {
                                        currentCourses.length === 0 && (
                                            <p className='text-center'>No courses found.</p>
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
                                    <label>Salaries:</label>

                                    <div className='form-group'>
                                        {/* Salary */}
                                        <div style={{ float: 'left', marginRight: '20px', marginBottom: '5px' }}>
                                            {/* Year selection dropdown */}
                                            <select className="form-select" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                                                {[...Array(5).keys()].map((_, index) => (
                                                    <option key={index} value={new Date().getFullYear() - index}>{new Date().getFullYear() - index}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Render salary table based on selected year */}
                                        {renderSalaryTable()}
                                        <div className="chart-area">
                                            <canvas ref={areaChartRef} id="myAreaChart" />
                                        </div>
                                    </div>
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

                    .form-select {
                        display: block;
                        width: 100%;
                        padding: 0.375rem 1.75rem 0.375rem 0.75rem;
                        font-size: 1rem;
                        font-weight: 400;
                        line-height: 1.5;
                        color: #495057;
                        background-color: #fff;
                        background-clip: padding-box;
                        border: 1px solid #ced4da;
                        border-radius: 0.25rem;
                        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                      }
                      
                      .form-select:focus {
                        border-color: #80bdff;
                        outline: 0;
                        box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
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
    )
}

export default EditTutor;
