import { React, useState, useEffect, useRef } from "react";
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import centerService from '../../services/center.service';
import { Link, useNavigate, useParams } from 'react-router-dom';
import staffService from '../../services/staff.service';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import accountService from '../../services/account.service';
import { Chart, PieController, ArcElement, registerables } from "chart.js";


const EditCenter = () => {

    Chart.register(PieController, ArcElement);
    Chart.register(...registerables);
    const pieChartRef = useRef(null);
    const areaChartRef = useRef(null);

    // Define isAdmin and isStaff outside of the component
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const isStaff = sessionStorage.getItem('isStaff') === 'true';

    const [center, setCenter] = useState({
        id: '',
        name: "",
        address: "",
        description: "",
        isActive: true,
        staffId: "",
        accountId: ""
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [tutorsPerPage] = useState(2);

    //list staff
    const [staffList, setStaffList] = useState([]);
    const [tutorList, setTutorList] = useState([]);
    const [salaryList, setSalaryList] = useState([]);



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name === 'isActive') {
            // For checkboxes (isActive), use the checked value
            setCenter({ ...center, [name]: checked });
        } else {
            // For other fields, use the regular value
            setCenter({ ...center, [name]: value });
        }
    };


    const { id } = useParams();


    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING


    useEffect(() => {
        if (id) {
            centerService
                .getCenterById(id)
                .then((res) => {
                    setCenter(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        }
    }, [id]);

    useEffect(() => {
        if (center?.accountId) {
            accountService
                .getAllSalariesByAccount(center?.accountId)
                .then((res) => {
                    setSalaryList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [center?.accountId]);

    useEffect(() => {
        centerService
            .getAllTutorsByCenter(id)
            .then((res) => {
                console.log(res.data);
                setTutorList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const filteredTutors = tutorList
        .filter((tutor) => {
            return (
                tutor.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    const pageCount = Math.ceil(filteredTutors.length / tutorsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * tutorsPerPage;
    const currentTutors = filteredTutors.slice(offset, offset + tutorsPerPage);


    useEffect(() => {
        staffService
            .getAllStaff()
            .then((res) => {
                console.log(res.data);
                setStaffList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (center.name.trim() === '') {
            errors.name = 'Center Name is required';
            isValid = false;
        }

        if (center.description.trim() === '') {
            errors.description = 'Description is required';
            isValid = false;
        }

        if (center.address.trim() === '') {
            errors.address = 'Address is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };




    const submitCenter = (e) => {
        e.preventDefault();

        if (validateForm()) {
            centerService
                .updateCenter(center.id, center)
                .then((res) => {
                    if (center.isActive) {
                        centerService.sendEmail(center.id);
                    }
                    navigate("/list-center/");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };


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
                                    <h4 className="header-title">CENTER INFORMATION</h4>

                                    <div className="alert alert-warning d-none fade show">
                                        <h4 className="mt-0 text-warning">Oh snap!</h4>
                                        <p className="mb-0">This form seems to be invalid :(</p>
                                    </div>
                                    <div className="alert alert-info d-none fade show">
                                        <h4 className="mt-0 text-info">Yay!</h4>
                                        <p className="mb-0">Everything seems to be ok :)</p>
                                    </div>
                                    {loading && (
                                        <div className="loading-overlay">
                                            <div className="loading-spinner" />
                                        </div>
                                    )}
                                    <form id="demo-form" data-parsley-validate onSubmit={(e) => submitCenter(e)}>
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div className="table-responsive">
                                                    <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-2" data-page-size={7}>
                                                        <tbody>
                                                            <tr>
                                                                <th>Center Name:</th>
                                                                <td>{center.name}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Email:</th>
                                                                <td>{center.email}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Description:</th>
                                                                <td>{center.description}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Phone Number:</th>
                                                                <td>{center.phoneNumber}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Tax Number:</th>
                                                                <td>{center.taxIdentificationNumber}</td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                {isAdmin && (
                                                    <div className="form-group mb-0">
                                                        {/* Approve Button */}
                                                        <button
                                                            type="submit"
                                                            className="btn btn-success mr-2"
                                                            onClick={() => setCenter({ ...center, isActive: true })}
                                                            style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                        >
                                                            <i class="fa-solid fa-thumbs-up"></i>
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-danger mr-2"
                                                            onClick={() => setCenter({ ...center, isActive: false })}
                                                            style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                        >
                                                            <i class="fa-solid fa-thumbs-down"></i>
                                                        </button>

                                                        {/* <button
                                                            type="submit"
                                                            className="btn btn-danger"
                                                        >
                                                            <i class="fas fa-user-slash"></i>                                                        </button> */}

                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {isAdmin && (

                                            <div className="form-group">
                                                <label htmlFor="staffId">Managed By *:</label>
                                                <select
                                                    className="form-control"
                                                    id="staffId"
                                                    name="staffId"
                                                    value={center.staffId}
                                                    onChange={handleChange}
                                                    style={{ borderRadius: '50px', padding: `8px 25px` }}
                                                >
                                                    <option value="">Select Staff</option>
                                                    {staffList.map((staff) => (
                                                        <option key={staff.id} value={staff.id}>
                                                            {staff.account ? staff.account.fullName : 'Unknown Name'}
                                                        </option>
                                                    ))}

                                                </select>


                                            </div>
                                        )}

                                        <div className="form-group">
                                            <label>Tutors Of Center:</label>

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
                                                            <th>Action</th>
                                                            {/* <th>Courses</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            currentTutors.length > 0 && currentTutors.map((tutor, index) => (
                                                                <tr key={tutor.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        <img src={tutor.account.imageUrl} style={{ height: '70px', width: '50px' }}>

                                                                        </img>
                                                                    </td>
                                                                    <td>{tutor.account && tutor.account.fullName ? tutor.account.fullName : 'Unknown Name'}</td>
                                                                    <td>{tutor.account && tutor.account.phoneNumber ? tutor.account.phoneNumber : 'Unknown Phone Number'}</td>
                                                                    <td>{tutor.account && tutor.account.gender !== undefined ? (tutor.account.gender ? 'Male' : 'Female') : 'Unknown Gender'}</td>                                                            <td>{tutor.account && tutor.account.dateOfBirth ? tutor.account.dateOfBirth : 'Unknown DOB'}</td>
                                                                    <td>
                                                                        {tutor.account.isActive ? (
                                                                            <span className="badge label-table badge-success">Active</span>
                                                                        ) : (
                                                                            <span className="badge label-table badge-danger">Inactive</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <Link to={`/edit-tutor/${tutor.account.id}`} className='text-secondary'>
                                                                            <i className="fa-regular fa-eye"></i>
                                                                        </Link>
                                                                    </td>
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
                                            currentTutors.length === 0 && (
                                                <p className='text-center'>There are no tutors.</p>
                                            )
                                        }
                                    </form>
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

export default EditCenter;