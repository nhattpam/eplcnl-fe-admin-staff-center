import React, { useEffect, useState } from 'react';
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai"; // icons form react-icons
import transactionService from '../../services/transaction.service';

const ListTransaction = () => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    console.log("STatus: " + storedLoginStatus)
    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }
    
    const [transactionList, setTransactionList] = useState([]);
    const [msg, setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [transactionsPerPage] = useState(5);

    const { staffId } = useParams();


    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING


    useEffect(() => {
        transactionService
            .getAllTransaction()
            .then((res) => {
                // Filter the transactions where isActive is true
                const filteredTransactionList = res.data;
                // Sort refundList by requestedDate
                const sortedTransactionList = [...filteredTransactionList].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
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

    const filteredTransactions = transactionList
        .filter((transaction) => {
            return (
                transaction.course?.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.course?.code.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.learner?.account?.fullName.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.learner?.account?.email.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredTransactions.length / transactionsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(offset, offset + transactionsPerPage);

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
                                        <div className="page-title-right">
                                            <ol className="breadcrumb m-0">
                                            </ol>
                                        </div>
                                        <h4 className="page-title">LIST OF TRANSACTIONS</h4>
                                    </div>
                                </div>
                            </div>
                            {/* end page title */}
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
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentTransactions.length > 0 && currentTransactions.map((cus) => (

                                                            <tr>
                                                                {
                                                                    cus.course !== null && (
                                                                        <>
                                                                            <td>
                                                                                <img src={cus.course?.imageUrl} style={{ height: '70px', width: '100px' }}>

                                                                                </img>
                                                                            </td>
                                                                        </>
                                                                    )
                                                                }
                                                                {
                                                                    cus.course === null && (
                                                                        <>
                                                                            <td>

                                                                            </td>
                                                                        </>
                                                                    )
                                                                }
                                                                {
                                                                    cus.course !== null && (
                                                                        <>
                                                                            <td>
                                                                                <Link to={`/edit-course/${cus.course?.id}`} className='text-secondary'>
                                                                                    {cus.course?.name}
                                                                                </Link>
                                                                            </td>
                                                                        </>
                                                                    )
                                                                }
                                                                {
                                                                    cus.course === null && (
                                                                        <>
                                                                            <td>
                                                                                Deposit to system
                                                                            </td>
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
                                                                            <td>
                                                                                ${cus.amount / 24000}
                                                                            </td>
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
                                                                            <td>

                                                                            </td>
                                                                        </>
                                                                    )
                                                                }

                                                                <td>
                                                                    <Link to={`/edit-learner/${cus.learner?.account?.id}`} className='text-secondary'>
                                                                        {cus.learner?.account?.fullName}
                                                                    </Link></td>
                                                                <td>{cus.transactionDate}</td>
                                                                <td>{cus.paymentMethod?.name}</td>
                                                                <td>{cus.status}</td>

                                                                {
                                                                    cus.course !== null && (
                                                                        <>
                                                                            <td>
                                                                                <Link to={`/edit-course/${cus.course?.id}`} className='text-secondary'>
                                                                                    <i class="fa-regular fa-eye"></i>
                                                                                </Link>
                                                                            </td>
                                                                        </>
                                                                    )
                                                                }
                                                                {
                                                                    cus.course === null && (
                                                                        <>
                                                                            <td>

                                                                            </td>
                                                                        </>
                                                                    )
                                                                }

                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>

                                            </table>
                                        </div> {/* end .table-responsive*/}
                                        {
                                            currentTransactions.length === 0 && (
                                                <p className='mt-2'>There are no transactions.</p>
                                            )
                                        }
                                    </div> {/* end card-box */}

                                </div> {/* end col */}
                            </div>
                            {/* end row */}
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


                        </div> {/* container */}
                    </div> {/* content */}
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}

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

export default ListTransaction