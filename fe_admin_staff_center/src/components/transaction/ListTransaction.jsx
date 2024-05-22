import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import transactionService from '../../services/transaction.service';
import courseService from '../../services/course.service';
import centerService from '../../services/center.service';
import tutorService from '../../services/tutor.service';
import * as XLSX from 'xlsx';

const ListTransaction = () => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    console.log("Status: " + storedLoginStatus);
    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`);
    }

    const [transactionList, setTransactionList] = useState([]);
    const [msg, setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [transactionsPerPage] = useState(5);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const { staffId } = useParams();

    // Loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        transactionService
            .getAllTransaction()
            .then((res) => {
                const filteredTransactionList = res.data;
                const sortedTransactionList = [...filteredTransactionList].sort((a, b) => {
                    return new Date(b.transactionDate) - new Date(a.transactionDate);
                });
                setTransactionList(sortedTransactionList);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const filteredTransactions = transactionList
        .filter((transaction) => {
            const transactionDate = new Date(transaction.transactionDate);
            const transactionYear = transactionDate.getFullYear();
            const transactionMonth = transactionDate.getMonth() + 1; // getMonth() returns 0-11
            const matchesYear = selectedYear ? transactionYear.toString() === selectedYear : true;
            const matchesMonth = selectedMonth ? transactionMonth.toString() === selectedMonth : true;
            return matchesYear && matchesMonth && (
                transaction.course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.course?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.learner?.account?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.learner?.account?.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    const pageCount = Math.ceil(filteredTransactions.length / transactionsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(offset, offset + transactionsPerPage);


    //DETAIL MONEY TRANSACTION
    const [center, setCenter] = useState({
        id: "",
        name: ""
    });

    const [tutor, setTutor] = useState({
        id: "",
        account: []
    });

    const [course, setCourse] = useState({
        id: "",
        tutor: []
    });

    const [expandedDetail, setExpandedDetail] = useState({});


    const closeTransactionDetailModal = () => {
        setExpandedDetail(false);
    };

    const toggleDetail = async (id) => {
        try {
            const transactionRes = await transactionService.getTransactionById(id);
            const transaction = transactionRes.data;
            const courseRes = await courseService.getCourseById(transaction.courseId);
            const courseData = courseRes.data;

            if (!courseData.tutor?.isFreelancer) {
                const centerRes = await centerService.getCenterById(courseData.tutor?.centerId);
                setCenter(centerRes.data);
            }

            if (courseData.tutor?.isFreelancer) {
                const tutorRes = await tutorService.getTutorById(courseData.tutorId);
                setTutor(tutorRes.data);
            }

            setCourse(courseData);

            setExpandedDetail((prevState) => ({
                ...prevState,
                [id]: !prevState[id],
            }));
        } catch (error) {
            console.error('Error fetching transaction details:', error);
        }
    };


    //EXPORT TO EXCEL
    const exportToExcel = () => {
        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Data for the sheet
        const data = [
            ["Year", selectedYear],
            ["Month", selectedMonth],
            [],
            ["Learner", "Course", "Date", "Payouts"]
        ];

        transactionList.forEach(cus => {
            const row = [
                cus.learner?.account?.fullName,
                cus.course?.name,
                new Date(cus.transactionDate).toLocaleString('en-US'),
                `$${(cus.amount / 24000).toFixed(2)}`
            ];
            data.push(row);
        });

        // Convert data to a worksheet
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

        // Export the workbook
        XLSX.writeFile(wb, `Transactions_${selectedYear}_${selectedMonth}.xlsx`);
    };


    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar isAdmin={sessionStorage.getItem('isAdmin') === 'true'}
                    isStaff={sessionStorage.getItem('isStaff') === 'true'}
                    isCenter={sessionStorage.getItem('isCenter') === 'true'} />
                <div className="content-page">
                    <div className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                        <div className="page-title-right">
                                            <ol className="breadcrumb m-0">
                                            </ol>
                                        </div>
                                        <h4 className="page-title">LIST OF TRANSACTIONS</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-box">
                                        <div className="mb-2">
                                            <div className="row">
                                                <div className="col-12 text-sm-center form-inline">
                                                    <div className="form-group">
                                                        <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" value={searchTerm}
                                                            onChange={handleSearch} style={{ borderRadius: '50px', padding: `18px 25px` }} />
                                                    </div>
                                                    <div className="form-group ml-2">
                                                        <select className="form-control" value={selectedYear} onChange={handleYearChange} style={{ borderRadius: '50px' }}>
                                                            <option value="">Select Year</option>
                                                            {[2022, 2023, 2024].map(year => (
                                                                <option key={year} value={year}>{year}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group ml-2">
                                                        <select className="form-control" value={selectedMonth} onChange={handleMonthChange} style={{ borderRadius: '50px' }}>
                                                            <option value="">Select Month</option>
                                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                                                                <option key={month} value={month}>{month}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group ml-2">
                                                        <button className="btn btn-success" onClick={exportToExcel} style={{ borderRadius: '50px' }}>
                                                            Export to Excel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {loading && (
                                            <div className="loading-overlay">
                                                <div className="loading-spinner" />
                                            </div>
                                        )}
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th data-toggle="true">Image</th>
                                                        <th data-toggle="true">Name</th>
                                                        <th data-hide="phone">Price</th>
                                                        <th data-hide="phone, tablet">Type</th>
                                                        <th data-hide="phone, tablet">Learner</th>
                                                        <th data-hide="phone, tablet">Transaction Date</th>
                                                        <th data-hide="phone, tablet">Payment Method</th>
                                                        <th data-hide="phone, tablet">Status</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentTransactions.length > 0 && currentTransactions.map((cus) => (
                                                            <>
                                                                <tr key={cus.id}>
                                                                    {
                                                                        cus.course !== null && (
                                                                            <>
                                                                                <td>
                                                                                    <img src={cus.course?.imageUrl} style={{ height: '70px', width: '100px' }} alt="course" />
                                                                                </td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        cus.course === null && (
                                                                            <>
                                                                                <td></td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        cus.course !== null && (
                                                                            <>
                                                                                <td>
                                                                                    <Link to={`/edit-course/${cus.course?.id}`} className='text-success'>
                                                                                        {cus.course?.name}
                                                                                    </Link>
                                                                                </td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        cus.course === null && (
                                                                            <>
                                                                                <td>Deposit to system</td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        cus.course !== null && (
                                                                            <>
                                                                                <td>${cus.course?.stockPrice}</td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        cus.course === null && (
                                                                            <>
                                                                                <td>${cus.amount / 24000}</td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        cus.course !== null && (
                                                                            <>
                                                                                <td>
                                                                                    <span className={`badge ${cus.course?.isOnlineClass ? 'badge-success' : 'badge-danger'}`}>{cus.isOnlineClass ? 'Class' : 'Video'}</span>
                                                                                </td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        cus.course === null && (
                                                                            <>
                                                                                <td></td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    <td>
                                                                        <Link to={`/edit-learner/${cus.learner?.account?.id}`} className='text-secondary'>
                                                                            {cus.learner?.account?.fullName}
                                                                        </Link>
                                                                    </td>
                                                                    <td>{new Date(cus.transactionDate).toLocaleString('en-US')}</td>
                                                                    <td>{cus.paymentMethod?.name}</td>
                                                                    <td>{cus.status === "DONE" ? 'DONE' : 'FAILED'}</td>
                                                                    {
                                                                        cus.course !== null && cus.status === "DONE" && (
                                                                            <td>
                                                                                <i className="fa-regular fa-eye" style={{ cursor: 'pointer' }} onClick={() => toggleDetail(cus.id)}></i>
                                                                            </td>
                                                                        )
                                                                    }

                                                                </tr>
                                                                {expandedDetail[cus.id] && (
                                                                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                                                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                                                                            <div className="modal-content">
                                                                                <div className="modal-header">
                                                                                    <h5 className="modal-title">Transaction Detail</h5>
                                                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeTransactionDetailModal}>
                                                                                        <span aria-hidden="true">&times;</span>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                                                                    <h4>Amount: <span className='text-danger'>${cus.amount / 24000}</span></h4>
                                                                                    {course.tutor?.isFreelancer && (
                                                                                        <>
                                                                                            <h4>Meowlish receives <span class='text-danger'>20%</span> of <span class='text-danger'>${cus.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.amount / 24000) * 0.2}</span></h4>
                                                                                            <h4>Tutor {tutor.account?.fullName} receives <span class='text-danger'>80%</span> of <span class='text-danger'>${cus.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.amount / 24000) * 0.8}</span></h4>

                                                                                        </>
                                                                                    )}
                                                                                    {!course.tutor?.isFreelancer && (
                                                                                        <>
                                                                                            <h4>Meowlish receives <span class='text-danger'>20%</span> of <span class='text-danger'>${cus.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.amount / 24000) * 0.2}</span></h4>
                                                                                            <h4>Center {center.name} receives <span class='text-danger'>80%</span> of <span class='text-danger'>${cus.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.amount / 24000) * 0.8}</span></h4>

                                                                                        </>

                                                                                    )}
                                                                                </div>
                                                                                <div className="modal-footer">
                                                                                    <button type="button" className="btn btn-dark" style={{ borderRadius: '50px', padding: '8px 25px' }} onClick={closeTransactionDetailModal}>Close</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>


                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        {
                                            currentTransactions.length === 0 && (
                                                <p className='mt-2'>There are no transactions.</p>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='container-fluid'>
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
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                .page-item.active .page-link{
                    background-color: #20c997;
                    border-color: #20c997;
                }

                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }
                
                .loading-spinner {
                    border: 8px solid rgba(245, 141, 4, 0.1);
                    border-top: 8px solid #f58d04;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
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
};

export default ListTransaction;
