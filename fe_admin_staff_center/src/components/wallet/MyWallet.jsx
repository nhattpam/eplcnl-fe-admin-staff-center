import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import refundRequestService from '../../services/refund-request.service';
import transactionService from '../../services/transaction.service';
import courseService from '../../services/course.service';
import accountService from '../../services/account.service';
import centerService from '../../services/center.service';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import staffService from '../../services/staff.service';

const MyWallet = () => {

    const [errors, setErrors] = useState({});
    const [centerList, setCenterList] = useState([]);
    const [msg, setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTerm2, setSearchTerm2] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPage2, setCurrentPage2] = useState(0);
    const [centersPerPage] = useState(2);
    const [staffList, setStaffList] = useState([]);
    const [staffsPerPage] = useState(2);

    const { accountId } = useParams();

    const [wallet, setWallet] = useState({
        id: "",
        balance: "",
        transactionDate: "",
    });


    useEffect(() => {
        if (accountId) {
            accountService
                .getWalletByAccount(accountId)
                .then((res) => {
                    setWallet(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [accountId]);


    useEffect(() => {
        centerService
            .getAllCenter()
            .then((res) => {
                // console.log(res.data);
                setCenterList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
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

    const pageCount = Math.ceil(filteredCenters.length / centersPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * centersPerPage;
    const currentCenters = filteredCenters.slice(offset, offset + centersPerPage);

    //list staff
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


    const handleSearch2 = (event) => {
        setSearchTerm2(event.target.value);
    };

    const filteredStaffs = staffList
        .filter((staff) => {
            return (
                staff.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount2 = Math.ceil(filteredStaffs.length / staffsPerPage);

    const handlePageClick2 = (data) => {
        setCurrentPage2(data.selected);
    };

    const offset2 = currentPage2 * staffsPerPage;
    const currentStaffs = filteredStaffs.slice(offset2, offset2 + staffsPerPage);

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
                                    <h4 className="header-title">MY WALLET</h4>

                                    <form id="demo-form" data-parsley-validate>
                                        <div className="form-group">
                                            <label htmlFor="transactionId">Wallet Balance:</label>
                                            <input type="text" className="form-control" name="transactionId"
                                                id="transactionId" value={wallet.balance} readOnly style={{ width: '30%' }} />
                                        </div>
                                        <label htmlFor="transactionId">Center Information:</label>

                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th data-toggle="true">No.</th>
                                                        <th data-toggle="true">Center Name</th>
                                                        <th>Email</th>
                                                        <th data-hide="phone">Description</th>
                                                        <th data-hide="phone, tablet">Address</th>
                                                        <th>Is Managed By</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentCenters.map((cus, index) => (
                                                        <tr key={cus.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{cus.name}</td>
                                                            <td>{cus.email}</td>
                                                            <td>{cus.description}</td>
                                                            <td>{cus.address}</td>
                                                            <td>{cus.staff && cus.staff.account ? cus.staff.account.fullName : 'Unknown Name'}</td>
                                                            <td>
                                                                {cus.isActive ? (
                                                                    <span className="badge label-table badge-success">Active</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-danger">Inactive</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <Link to={`/edit-center/${cus.id}`} className='text-secondary'>
                                                                    <i className="fa-regular fa-eye"></i>
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                <Link to={`/edit-center/${cus.id}`} className='btn btn-success'>
                                                                    Transfer
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>


                                            </table>

                                        </div> {/* end .table-responsive*/}

                                        {/* Pagination */}
                                        <div className='container-fluid mt-2'>
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

                                    </form>


                                    <label htmlFor="transactionId" >Staff Information:</label>
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
                                                    <th>Action</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentStaffs.map((cus, index) => (

                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img src={cus.account.imageUrl} style={{ height: '70px', width: '50px' }}>

                                                            </img>
                                                        </td>
                                                        <td>{cus.account.fullName}</td>
                                                        <td>{cus.account.email}</td>
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
                                                            <Link to={`/edit-staff/${cus.account.id}`} className='text-secondary'>
                                                                <i class="fa-regular fa-eye"></i>
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <Link to={`/edit-center/${cus.id}`} className='btn btn-success'>
                                                                Transfer
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>
                                    </div> {/* end .table-responsive*/}

                                </div> {/* end card-box*/}

                            </div> {/* end col*/}
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
    )
}

export default MyWallet;
