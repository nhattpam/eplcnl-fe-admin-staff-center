import React, { useEffect, useState } from 'react';
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai"; // icons form react-icons
import staffService from '../../services/staff.service';


const ListReportByStaff = () => {

    const [ReportList, setReportList] = useState([]);
    const [msg, setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [ReportsPerPage] = useState(5);

    const { staffId } = useParams();


    useEffect(() => {
        staffService
            .getAllReportsByStaff(staffId)
            .then((res) => {
                // console.log(res.data);
                setReportList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredReports = ReportList
        .filter((Report) => {
            return (
                Report.course?.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                Report.learner?.account?.fullName.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredReports.length / ReportsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * ReportsPerPage;
    const currentReports = filteredReports.slice(offset, offset + ReportsPerPage);



    //open reason
    const [showReason, setShowReason] = useState(false);
    const [expandedReasons, setExpandedReasons] = useState({});

    //qualification
    const openReasonModal = () => {
        setExpandedReasons(true);

    };

    const closeReasonModal = () => {
        setExpandedReasons(false);
    };

    const toggleReason = (id) => {
        setExpandedReasons(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar isAdmin={sessionStorage.getItem('isAdmin') === 'true'}
                    isStaff={sessionStorage.getItem('isStaff') === 'true'}
                    isReport={sessionStorage.getItem('isReport') === 'true'} />
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
                                        <h4 className="page-title">LIST OF REPORTS</h4>
                                    </div>
                                </div>
                            </div>
                            {/* end page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card-box">
                                        <div className="mb-2">
                                            <div className="row">
                                                <div className="col-12 text-sm-Report form-inline">

                                                    <div className="form-group">
                                                        <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on"
                                                            value={searchTerm}
                                                            onChange={handleSearch} style={{ borderRadius: '50px', padding: `18px 25px` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th data-toggle="true">No.</th>
                                                        <th data-hide="phone">Course</th>
                                                        <th>Learner</th>
                                                        <th>Report Date</th>
                                                        {/* <th>Action</th> */}
                                                        <th data-hide="phone, tablet">Reason</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentReports.length > 0 && currentReports.map((cus, index) => (
                                                            <>
                                                                <tr key={cus.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        <Link to={`/edit-course/${cus.course.id}`} className='text-success'>
                                                                            {cus.course && cus.course.name ? cus.course.name : 'Unknown Name'}
                                                                        </Link>
                                                                    </td>
                                                                    <td>{cus.learner && cus.learner.account.fullName ? cus.learner.account.fullName : 'Unknown Name'}</td>
                                                                    <td>{cus.reportedDate}</td>

                                                                    <td onClick={() => toggleReason(cus.id)}>
                                                                        <i className="far fa-eye"></i>
                                                                    </td>

                                                                </tr>
                                                                {expandedReasons[cus.id] && (
                                                                    <>
                                                                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}
                                                                        >
                                                                            <div className="modal-dialog modal-lg modal-dialog-centered" role="document"> {/* Added modal-dialog-centered class */}

                                                                                <div className="modal-content" >


                                                                                    <div className="modal-header">
                                                                                        <h5 className="modal-title">Reason</h5>
                                                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeReasonModal}>
                                                                                            <span aria-hidden="true">&times;</span>
                                                                                        </button>
                                                                                    </div>
                                                                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}
                                                                                        <div dangerouslySetInnerHTML={{ __html: cus.reason }}>

                                                                                        </div>
                                                                                        <div>
                                                                                            <img src={cus.imageUrl} style={{width: '700px', height: '300px'}}></img>
                                                                                        </div>
                                                                                        <div className="modal-footer">
                                                                                            {/* Conditional rendering of buttons based on edit mode */}
                                                                                            <button type="button" className="btn btn-dark"  style={{ borderRadius: '50px', padding: `8px 25px` }} onClick={closeReasonModal}>Close</button>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </>

                                                                )}
                                                            </>


                                                        ))
                                                    }

                                                </tbody>


                                            </table>
                                        </div> {/* end .table-responsive*/}
                                        {
                                            currentReports.length === 0 && (
                                                <p className='text-center mt-3'>No reports found.</p>
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

                
            `}
            </style>
        </>
    )
}

export default ListReportByStaff