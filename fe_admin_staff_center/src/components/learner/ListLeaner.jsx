import React, { useEffect, useState } from 'react';
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai"; // icons form react-icons
import learnerService from '../../services/learner.service';

const ListLearner = () => {

    const [learnerList, setLearnerList] = useState([]);
    const [msg, setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [learnersPerPage] = useState(5);

    useEffect(() => {
        learnerService
            .getAllLearner()
            .then((res) => {
                console.log(res.data);
                const sortedLearners = res.data.sort((a, b) => {
                    // Assuming createdDate is a valid property on account
                    const dateA = new Date(a.account?.createdDate);
                    const dateB = new Date(b.account?.createdDate);
                    return dateB - dateA; // Sort in descending order, change to dateA - dateB for ascending
                });
                setLearnerList(sortedLearners);

            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredLearners = learnerList.filter((learner) => {
        const fullName = learner.account?.fullName || '';
        const email = learner.account?.email || '';
        const phoneNumber = learner.account?.phoneNumber || '';
        return (
            fullName.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            phoneNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });
    

    const pageCount = Math.ceil(filteredLearners.length / learnersPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * learnersPerPage;
    const currentLearners = filteredLearners.slice(offset, offset + learnersPerPage);

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
                                        <h4 className="page-title">LIST OF LEARNERS</h4>
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
                                                            onChange={handleSearch} style={{ borderRadius: '50px', padding: `18px 25px` }}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th data-toggle="true">No.</th>
                                                        <th data-toggle="true">Image</th>
                                                        <th data-toggle="true">Full Name</th>
                                                        <th data-hide="phone">Email</th>
                                                        <th data-hide="phone, tablet">DOB</th>
                                                        <th data-hide="phone, tablet">Gender</th>
                                                        <th data-hide="phone, tablet">Phone Number</th>
                                                        <th data-hide="phone, tablet">Status</th>
                                                        <th data-hide="phone, tablet">Joined Date</th>

                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentLearners.length > 0 && currentLearners.map((cus, index) => (

                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <img src={cus.account.imageUrl} style={{ height: '70px', width: '50px' }}>

                                                                    </img>
                                                                </td>
                                                                <td>{cus.account?.fullName}</td>
                                                                <td>{cus.account?.email}</td>
                                                                <td>{cus.account && cus.account.dateOfBirth ? cus.account.dateOfBirth.substring(0, 10) : 'Unknown DOB'}</td>
                                                                <td>
                                                                    {cus.account.gender ? (
                                                                        <span className="badge label-table badge-success">Male</span>
                                                                    ) : (
                                                                        <span className="badge label-table badge-danger">Female</span>
                                                                    )}
                                                                </td>
                                                                <td>{cus.account && cus.account.phoneNumber ? cus.account.phoneNumber : 'Unknown Phone Number'}</td>
                                                                <td>
                                                                    {cus.account.isActive ? (
                                                                        <span className="badge label-table badge-success">Active</span>
                                                                    ) : (
                                                                        <span className="badge label-table badge-danger">Inactive</span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {cus.account?.createdDate}
                                                                </td>
                                                                <td>
                                                                    <Link to={`/edit-learner/${cus.account.id}`} className='text-secondary'>
                                                                        <i class="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>

                                            </table>
                                        </div> {/* end .table-responsive*/}
                                    </div> {/* end card-box */}
                                    {
                                        currentLearners.length === 0 && (
                                            <p>There are no Learners.</p>
                                        )
                                    }
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

export default ListLearner