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

    const [refundList, setRefundList] = useState([]);
    const [msg, setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [refundsPerPage] = useState(5);



    useEffect(() => {
        refundRequestService
            .getAllRefundRequest()
            .then((res) => {
                // Filter the refunds where isActive is true
                setRefundList(res.data);
            })
            .catch((error) => {
                console.log(error);
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
                                        <div className="mb-2">
                                            <div className="row">
                                                <div className="col-12 text-sm-center form-inline">

                                                    <div className="form-group">
                                                        <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" value={searchTerm}
                                                            onChange={handleSearch} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-bordered toggle-circle mb-0" data-page-size={7}>
                                                <thead>
                                                    <tr>
                                                        <th data-toggle="true">Transaction Id</th>
                                                        <th data-toggle="true">Requested Date</th>
                                                        <th data-toggle="true">Approved Date</th>
                                                        <th data-hide="phone, tablet">Reason</th>
                                                        <th data-hide="phone, tablet">Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentRefunds.map((cus) => (

                                                        <tr>
                                                            <td>{cus.transactionId}</td>
                                                            <td>{cus.requestedDate}</td>
                                                            <td>{cus.approvedDate}</td>
                                                            <td>{cus.reason}</td>
                                                            <td>
                                                                {cus.status === "DONE" ? (
                                                                    <span className="badge label-table badge-success">DONE</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-danger">PROCESSING</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <Link to={`/edit-refund/${cus.id}`} className='text-secondary'>
                                                                    <i class="fa-regular fa-eye"></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>

                                            </table>
                                        </div> {/* end .table-responsive*/}
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
            `}
            </style>
        </>
    )
}

export default ListRefundRequest