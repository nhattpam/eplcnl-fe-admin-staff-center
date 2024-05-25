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
import tutorService from '../../services/tutor.service';
import enrollmentService from '../../services/enrollment.service';
import walletHistoryService from '../../services/wallet-history.service';
import walletService from '../../services/wallet.service';
import salaryService from '../../services/salary.service';

const CenterWallet = () => {

    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    console.log("STatus: " + storedLoginStatus)
    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }

    const [errors, setErrors] = useState({});
    const [centerList, setCenterList] = useState([]);
    const [msg, setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTerm2, setSearchTerm2] = useState('');
    const [searchTerm3, setSearchTerm3] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPage2, setCurrentPage2] = useState(0);
    const [currentPage3, setCurrentPage3] = useState(0);
    const [centersPerPage] = useState(2);
    const [staffList, setStaffList] = useState([]);
    const [staffsPerPage] = useState(2);
    const [tutorList, setTutorList] = useState([]);
    const [tutorsPerPage] = useState(5);


    const [tutorSalaryList, setTutorSalaryList] = useState([]);

    const [checkTransferred, setCheckTransferred] = useState(false);

    const { centerId } = useParams();


    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING


    const [wallet, setWallet] = useState({
        id: "",
        balance: "",
    });

    const [center, setCenter] = useState({
        accountId: ""
    });

    const [totalAmount, setTotalAmount] = useState(0);
    const [amountToTransfer, setAmountToTransfer] = useState(0);

    const [account, setAccount] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        imageUrl: "",
        gender: ""
    });


    useEffect(() => {
        if (centerId) {
            centerService.getCenterById(centerId)
                .then((res) => {
                    setCenter(res.data);
                    accountService
                        .getWalletByAccount(res.data.accountId)
                        .then((res) => {
                            setWallet(res.data);
                            setLoading(false);
                        })
                        .catch((error) => {
                            console.log(error);
                            setLoading(false);
                        });
                })

        }
    }, [centerId]);


    //list tutor freelancer
    useEffect(() => {
        centerService
            .getAllTutorsByCenter(centerId) // Corrected the usage of the condition
            .then((res) => {

                setTutorList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);



    const handleSearch3 = (event) => {
        setSearchTerm3(event.target.value);
    };

    const filteredTutors = tutorList
        .filter((tutor) => {
            return (
                tutor.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount3 = Math.ceil(filteredTutors.length / tutorsPerPage);

    const handlePageClick3 = (data) => {
        setCurrentPage3(data.selected);
    };

    const offset3 = currentPage3 * tutorsPerPage;
    const currentTutors = filteredTutors.slice(offset3, offset3 + tutorsPerPage);


    //TRANSFER
    const [showModal, setShowModal] = useState(false);

    const openModal = (accountId, tutorId) => {
        setShowModal(true);
        if (accountId) {
            accountService
                .getAccountById(accountId)
                .then((res) => {
                    setAccount(res.data);
                    // CHECK ALREADY TRANSFERRED SALARY
                    accountService
                        .getAllSalariesByAccount(res.data.id)
                        .then((res) => {
                            const salaries = res.data;
                            const currentDateTime = new Date();
                            const isTransferred = salaries.some((salary) => {
                                return (
                                    currentDateTime.getMonth() + 1 === salary.month &&
                                    currentDateTime.getFullYear() === salary.year
                                );
                            });
                            setCheckTransferred(isTransferred);
                            setTutorSalaryList(salaries);

                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    // CHECK ALREADY TRANSFERRED SALARY
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        tutorService.getTotalAmountByTutor(tutorId)
            .then((res) => {
                setTotalAmount(res.data);
                setAmountToTransfer(res.data * 0.7);
            })
    };

    const closeModal = () => {
        setShowModal(false);
    };



    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        // Function to update currentDateTime every second
        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Clean-up function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    const [tutorAccount, setTutorAccount] = useState({
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
        note: "",
        isDeleted: ""
    });

    const submitWallet = async (e) => {
        e.preventDefault();
        // Capture the amount from the input field and calculate 20% of it in one step
        const amount = parseFloat(e.target.amount.value * 0.7);

        try {
            const centerWallet = { // Use object syntax {} instead of array syntax []
                id: wallet.id,
                balance: wallet.balance - amount,
                accountId: wallet.accountId
            };
            console.log(JSON.stringify(centerWallet))

            await walletService.updateWallet(centerWallet.id, centerWallet);

            const walletHistory = { // Similarly, use object syntax {} here
                transactionDate: currentDateTime,
                walletId: centerWallet.id,
                note: `- ${amount}$ for transfering to tutor ${account.fullName} at ${currentDateTime}`
            };
            await walletHistoryService.saveWalletHistory(walletHistory);


            const tutorWallet = {
                id: account.wallet?.id,
                balance: account.wallet?.balance + amount,
                accountId: account.id
            };
            console.log(JSON.stringify(tutorWallet))

            await walletService.updateWallet(tutorWallet.id, tutorWallet);

            const walletHistoryTutor = {
                transactionDate: currentDateTime,
                walletId: tutorWallet.id,
                note: `+ ${amount}$ for receiving salary from center at ${currentDateTime}`

            };
            await walletHistoryService.saveWalletHistory(walletHistoryTutor);

            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthIndex = currentDateTime.getMonth();
            const monthName = months[monthIndex];
            const year = currentDateTime.getFullYear();


            const tutorSalary = {
                accountId: account.id,
                month: currentDateTime.getMonth() + 1,
                year: year,
                amount: amount,
                note: "Salary for " + monthName + ", " + year + ` is $${amount}`
            };

            await salaryService.saveSalary(tutorSalary);


            closeModal();
            window.alert("Transfer successfully!");

            // Reload the page
            window.location.reload();

        } catch (error) {
            console.log(error);
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
                                    <h4 className="header-title">MY WALLET</h4>

                                    <div className="form-group">
                                        <label htmlFor="transactionId">Wallet Balance:</label>
                                        <span style={{ fontWeight: 'bold', color: 'red' }} className='ml-1'>
                                            ${wallet.balance}
                                        </span>
                                    </div>

                                    <label htmlFor="transactionId" >Tutor Information:</label>
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
                                                    <th data-toggle="true">Image</th>
                                                    <th data-toggle="true">Full Name</th>
                                                    <th data-hide="phone">Email</th>
                                                    <th data-hide="phone, tablet">DOB</th>
                                                    <th data-hide="phone, tablet">Gender</th>
                                                    <th data-hide="phone, tablet">Phone Number</th>
                                                    <th data-hide="phone, tablet">Status</th>
                                                    <th>Action</th>
                                                    {/* <th></th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    currentTutors.length > 0 && currentTutors.map((cus, index) => (

                                                        <tr>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <img src={cus.account?.imageUrl} style={{ height: '70px', width: '50px' }}>

                                                                </img>
                                                            </td>
                                                            <td>{cus.account?.fullName}</td>
                                                            <td>{cus.account?.email}</td>
                                                            <td>{cus.account && cus.account?.dateOfBirth ? cus.account?.dateOfBirth.substring(0, 10) : 'Unknown DOB'}</td>
                                                            <td>
                                                                {cus.account.gender ? (
                                                                    <span className="badge label-table badge-success">Male</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-danger">Female</span>
                                                                )}
                                                            </td>
                                                            <td>{cus.account && cus.account?.phoneNumber ? cus.account?.phoneNumber : 'Unknown Phone Number'}</td>
                                                            <td>
                                                                {cus.account.isActive ? (
                                                                    <span className="badge label-table badge-success">Active</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-danger">Inactive</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <Link to={`/edit-tutor/${cus.account?.id}`} className='text-secondary'>
                                                                    <i class="fa-regular fa-eye"></i>
                                                                </Link>
                                                            </td>
                                                            {/* <td>
                                                                <button className='btn btn-success' onClick={() => openModal(cus.account?.id, cus.id)} style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                                                    Transfer
                                                                </button>
                                                            </td> */}
                                                        </tr>
                                                    ))
                                                }

                                            </tbody>

                                        </table>
                                        {
                                            currentTutors.length === 0 && (
                                                <p className='text-center mt-3'>There are no tutors.</p>
                                            )
                                        }
                                    </div> {/* end .table-responsive*/}
                                </div> {/* end card-box*/}

                                {showModal && (
                                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <form onSubmit={submitWallet}>

                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Your balance: ${wallet.balance}</h5>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">

                                                        <div className='row'>
                                                            <div className="col-md-4">
                                                                <img src={account.imageUrl} alt="avatar" className="rounded-circle mt-4" style={{ width: '90%' }} />

                                                            </div>
                                                            <div className="col-md-8">
                                                                <table className="table table-responsive table-hover mt-3">
                                                                    <tbody>
                                                                        <tr>
                                                                            <th style={{ width: '30%' }}>Full Name:</th>
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
                                                                            <th>Gender:</th>
                                                                            <td>
                                                                                {account.gender ? (
                                                                                    <span className="badge label-table badge-success">Male</span>
                                                                                ) : (
                                                                                    <span className="badge label-table badge-danger">Female</span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <h4>Revenue this month: ${totalAmount}</h4>
                                                                <p>Amount to transfer: ${totalAmount} x 70% = ${amountToTransfer}</p>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <input type='hidden' name='amount' value={totalAmount} className='form-control' />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="modal-footer">
                                                        {!checkTransferred && wallet.balance >= amountToTransfer && (
                                                            <button type="submit" className="btn btn-warning" style={{ borderRadius: '50px', padding: `8px 25px` }}>Transfer</button>
                                                        )}
                                                        {checkTransferred && wallet.balance >= amountToTransfer && (
                                                            <button type="button" className="btn btn-warning" disabled style={{ borderRadius: '50px', padding: `8px 25px` }}>Transferred!</button>
                                                        )}
                                                        <button type="button" className="btn btn-dark" onClick={closeModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                                    </div>
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                            pageCount={pageCount3}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            onPageChange={handlePageClick3}
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
                            </div> {/* end col*/}
                            {/* Pagination */}


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

export default CenterWallet;
