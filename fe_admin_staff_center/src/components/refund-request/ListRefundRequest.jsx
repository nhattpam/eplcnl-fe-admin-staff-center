import React, { useEffect, useState } from 'react';
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai"; // icons form react-icons
import refundRequestService from '../../services/refund-request.service';

const ListRefundRequest = () => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    console.log("STatus: " + storedLoginStatus)
    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }

    const [refundList, setRefundList] = useState([]);
    const [msg, setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [refundsPerPage] = useState(5);

    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING


    useEffect(() => {
        refundRequestService
            .getAllRefundRequest()
            .then((res) => {
                // Filter the refunds where isActive is true
                const filteredRefundList = res.data;
                // Sort refundList by requestedDate
                const sortedRefundList = [...filteredRefundList].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.requestedDate) - new Date(a.requestedDate);
                });
                setRefundList(sortedRefundList);
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

    const filteredRefunds = refundList
        .filter((refund) => {
            return (
                refund.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredRefunds.length / refundsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * refundsPerPage;
    const currentRefunds = filteredRefunds.slice(offset, offset + refundsPerPage);

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
                                        <h4 className="page-title">LIST OF REFUND REQUESTS</h4>
                                    </div>
                                </div>
                            </div>
                            {/* end page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-box">
                                        {loading && (
                                            <div className="loading-overlay">
                                                <div className="loading-spinner" />
                                            </div>
                                        )}
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th data-toggle="true">No.</th>
                                                        <th data-toggle="true">Requested Date</th>
                                                        <th data-toggle="true">Approved Date</th>
                                                        <th data-hide="phone, tablet">Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentRefunds.length > 0 && currentRefunds.map((cus, index) => (

                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>{new Date(cus.requestedDate).toLocaleString('en-US')}</td>

                                                                {
                                                                    cus.approvedDate && (
                                                                        <td>{new Date(cus.approvedDate).toLocaleString('en-US')}</td>

                                                                    )
                                                                }
                                                                {
                                                                    !cus.approvedDate && (
                                                                        <td><i class="fa-solid fa-ban"></i></td>

                                                                    )
                                                                }
                                                                <td>
                                                                    {cus.status === "APPROVED" && (
                                                                        <span className="badge label-table badge-success">APPROVED</span>
                                                                    )
                                                                    }
                                                                    {cus.status === "DISAPPROVED" && (
                                                                        <span className="badge label-table badge-danger">DISAPPROVED</span>
                                                                    )
                                                                    }
                                                                    {cus.status === "PROCESSING" && (
                                                                        <span className="badge label-table badge-danger">PROCESSING</span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <Link to={`/edit-refund/${cus.id}`} className='text-secondary'>
                                                                        <i class="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>

                                            </table>
                                        </div> {/* end .table-responsive*/}
                                        {
                                            currentRefunds.length === 0 && (
                                                <p className='text-center mt-3'>No refund requests found.</p>
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

export default ListRefundRequest