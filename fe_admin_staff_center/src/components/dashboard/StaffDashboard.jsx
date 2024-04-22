import { React, useState, useEffect, useRef } from "react";
import Header from '../Header'
import Footer from '../Footer'
import Sidebar from '../Sidebar'
import { Chart, PieController, ArcElement, registerables } from "chart.js";
import staffService from "../../services/staff.service";
import { Link } from "react-router-dom";
import accountService from "../../services/account.service";

const StaffDashboard = () => {


    const [tutorCount, setTutorCount] = useState(0);
    const [centerCount, setCenterCount] = useState(0);

    const storedStaffId = localStorage.getItem('staffId');
    const storedAccountId = localStorage.getItem('accountId');

    const [salaryList, setSalaryList] = useState([]);

    useEffect(() => {
        countCenters();
        countTutors();
    }, []);

    const [account, setAccount] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        imageUrl: "",
        gender: "",
        wallet: []
    });

    useEffect(() => {
        if (storedAccountId) {
            accountService
                .getAccountById(storedAccountId)
                .then((res) => {
                    setAccount(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
            accountService
                .getAllSalariesByAccount(storedAccountId)
                .then((res) => {
                    setSalaryList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [storedAccountId]);

    // Function to count the centers
    async function countCenters() {
        try {
            const response = await staffService.getAllCentersByStaff(storedStaffId)
            const centers = response.data;
            const centerCount = centers.length;


            setCenterCount(centerCount);
        } catch (error) {
            console.error("Error counting centers:", error);
        }
    }

    // Function to count the centers
    async function countTutors() {
        try {
            const response = await staffService.getAllTutorsByStaff(storedStaffId)
            const tutors = response.data;
            const tutorCount = tutors.length;


            setTutorCount(tutorCount);
        } catch (error) {
            console.error("Error counting tutors:", error);
        }
    }

    //wating courses
    const [tutorList, setTutorList] = useState([]);

    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [tutorsPerPage] = useState(5);


    useEffect(() => {
        staffService
            .getAllTutorsByStaff(storedStaffId)
            .then((res) => {
                console.log(res.data);
                setTutorList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [storedStaffId]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    console.log(typeof tutorList);

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

    //list center
    const [centerList, setCenterList] = useState([]);
    const [searchTerm2, setSearchTerm2] = useState('');
    const [currentPage2, setCurrentPage2] = useState(0);
    const [centersPerPage] = useState(5);

    useEffect(() => {
        staffService
            .getAllCentersByStaff(storedStaffId)
            .then((res) => {
                // console.log(res.data);
                setCenterList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [storedStaffId]);


    const handleSearch2 = (event) => {
        setSearchTerm2(event.target.value);
    };

    const filteredCenters = centerList
        .filter((center) => {
            return (
                center.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                center.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                center.description.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                center.email.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                center.address.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                center.isActive.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount2 = Math.ceil(filteredCenters.length / centersPerPage);

    const handlePageClick2 = (data) => {
        setCurrentPage2(data.selected);
    };

    const offset2 = currentPage2 * centersPerPage;
    const currentCenters = filteredCenters.slice(offset2, offset2 + centersPerPage);


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

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar isAdmin={sessionStorage.getItem('isAdmin') === 'true'}
                    isStaff={sessionStorage.getItem('isStaff') === 'true'}
                    isCenter={sessionStorage.getItem('isCenter') === 'true'} />
                {/* ============================================================== */}
                {/* Start Page Content here */}
                {/* ============================================================== */}
                <div className="content-page">
                    <div className="content">
                        {/* Start Content*/}
                        <div className="container-fluid">
                            {/* start page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">

                                        <h4 className="page-title">Dashboard</h4>
                                    </div>
                                </div>
                            </div>
                            {/* end page title */}
                            <div className="row">
                                <div className="col-md-6 col-xl-3 salary" onClick={openSalaryModal}>
                                    <div className="widget-rounded-circle card-box">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="avatar-lg rounded-circle bg-soft-warning border-warning border">
                                                    <i className="fe-heart font-22 avatar-title text-warning" />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-right">
                                                    <h3 className="mt-1">$<span data-plugin="counterup">{account.wallet?.balance}</span></h3>
                                                    <p className="text-muted mb-1 text-truncate">Total Revenue</p>
                                                </div>
                                            </div>
                                        </div> {/* end row*/}
                                    </div> {/* end widget-rounded-circle*/}
                                </div> {/* end col*/}
                                <div className="col-md-6 col-xl-3">
                                    <div className="widget-rounded-circle card-box">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="avatar-lg rounded-circle bg-soft-primary border-primary border">
                                                    <i className="ti-world font-22 avatar-title text-primary" />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-right">
                                                    <h3 className="mt-1"><span data-plugin="counterup">{centerCount}</span></h3>
                                                    <p className="text-muted mb-1 text-truncate">Total Centers</p>
                                                </div>
                                            </div>
                                        </div> {/* end row*/}
                                    </div> {/* end widget-rounded-circle*/}
                                </div> {/* end col*/}
                                <div className="col-md-6 col-xl-3">
                                    <div className="widget-rounded-circle card-box">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="avatar-lg rounded-circle bg-soft-success border-success border">
                                                    <i className="icon-people font-22 avatar-title text-success" />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-right">
                                                    <h3 className="text-dark mt-1"><span data-plugin="counterup">{tutorCount}</span></h3>
                                                    <p className="text-muted mb-1 text-truncate">Total Tutors</p>
                                                </div>
                                            </div>
                                        </div> {/* end row*/}
                                    </div> {/* end widget-rounded-circle*/}
                                </div> {/* end col*/}

                            </div>
                            {/* end row*/}

                            {/* end row */}
                            <div className="row">
                                <div className="col-xl-6">
                                    <div className="card-box">
                                        <div className="dropdown float-right">

                                        </div>
                                        <h4 className="header-title mb-3">Top 5 Tutors</h4>
                                        <div className="table-responsive">
                                            <table className="table table-borderless table-hover table-nowrap table-centered m-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>Image</th>
                                                        <th>Profile</th>
                                                        <th>Address</th>
                                                        <th>Phone Number</th>
                                                        <th>Status</th>
                                                        <th>Email</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentTutors.length > 0 && currentTutors.map((tutor, index) => (
                                                            <tr>
                                                                <td style={{ width: 36 }}>
                                                                    <img src={tutor.account.imageUrl} alt="contact-img" title="contact-img" className="rounded-circle avatar-sm" />
                                                                </td>
                                                                <td>
                                                                    <h5 className="m-0 font-weight-normal">{tutor.account.fullName}</h5>
                                                                </td>
                                                                <td>
                                                                    {tutor.account.address}
                                                                </td>
                                                                <td>
                                                                    {tutor.account.phoneNumber}
                                                                </td>
                                                                <td>
                                                                    {tutor.account.isActive ? (
                                                                        <span className="badge label-table badge-success">Active</span>
                                                                    ) : (
                                                                        <span className="badge label-table badge-danger">Inactive</span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {tutor.account.email}
                                                                </td>
                                                                <td>
                                                                    <Link to={`/edit-tutor/${tutor.account.id}`} className="btn btn-xs btn-light"><i className="mdi mdi-pencil" /></Link>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }


                                                </tbody>
                                            </table>
                                        </div>
                                        {
                                            currentTutors.length === 0 && (
                                                <p className="text-center mt-3">No tutors yet.</p>
                                            )
                                        }

                                    </div>

                                </div> {/* end col */}
                                <div className="col-xl-6">
                                    <div className="card-box">
                                        <div className="dropdown float-right">

                                        </div>
                                        <h4 className="header-title mb-3">Top 5 Centers</h4>
                                        <div className="table-responsive">
                                            <table className="table table-borderless table-nowrap table-hover table-centered m-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>Profile</th>
                                                        <th>Address</th>
                                                        <th>Phone Number</th>
                                                        <th>Email</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentCenters.length > 0 && currentCenters.map((cus) => (

                                                            <tr>
                                                                <td>
                                                                    <h5 className="m-0 ">{cus.name}</h5>
                                                                </td>
                                                                <td>
                                                                    <i className="mdi  text-primary" /> {cus.address}
                                                                </td>
                                                                <td>
                                                                    {cus.phoneNumber}
                                                                </td>
                                                                <td>
                                                                    {cus.email}
                                                                </td>
                                                                <td>
                                                                    <Link to={`/edit-center/${cus.id}`} className="btn btn-xs btn-light"><i className="mdi mdi-pencil" /></Link>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }


                                                </tbody>
                                            </table>
                                        </div> {/* end .table-responsive*/}
                                        {
                                            currentCenters.length === 0 && (
                                                <p className="text-center mt-3">No centers yet.</p>
                                            )
                                        }
                                    </div> {/* end card-box*/}

                                </div> {/* end col */}
                            </div>
                            {/* end row */}
                        </div> {/* container */}
                    </div> {/* content */}
                    {/* Footer Start */}

                    {/* end Footer */}
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}

            </div>
            {showSalaryModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Salary History</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeSalaryModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Year selection dropdown */}
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
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark" onClick={closeSalaryModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>
                {`
              
              .salary:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              }
              /* Custom modal size */
.custom-modal-xl {
    max-width: 90%;
    width: 90%;
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
  
              
                `}
            </style>
        </>
    )
}

export default StaffDashboard