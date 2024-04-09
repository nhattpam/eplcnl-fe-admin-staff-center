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

const MyWallet = () => {

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
    const [tutorsPerPage] = useState(2);

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
                const activeCenters = res.data.filter((center) => center.isActive === true);

                setCenterList(activeCenters);

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

    //list tutor freelancer
    useEffect(() => {
        tutorService
            .getAllTutor() // Corrected the usage of the condition
            .then((res) => {
                const tutorFreelancers = res.data.filter((tutor) => tutor.isFreelancer === true);

                console.log(tutorFreelancers);
                setTutorList(tutorFreelancers);
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

    //Auto transfer
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        // Function to update currentDateTime every second
        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Clean-up function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    const [enrollmentList, setEnrollmentList] = useState([]);

    useEffect(() => {
        const processEnrollments = async () => {

            try {
                const res = await enrollmentService.getAllEnrollment();


                const activeEnrollments = res.data.filter((enrollment) => !enrollment.refundStatus);
                setEnrollmentList(activeEnrollments);

                console.log(activeEnrollments.length)

            } catch (error) {
                console.error("Error fetching enrollments:", error);
            }
        }

        processEnrollments();
    }, []);

    useEffect(() => {
        const currentDate = new Date();
        tutorList.forEach(async (tutor) => { // Changed forEach to async forEach
            for (const enrollment of enrollmentList) { // Changed forEach to for...of loop for asynchronous handling
                if (enrollment.enrolledDate) {
                    const enrolledDate = new Date(enrollment.enrolledDate);
                    const differenceInMs = currentDate - enrolledDate;
                    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

                    if (differenceInDays > 7) {
                        console.log("Enrollment", enrollment.id, "exceeds 7 days from enrolled date.");

                        if (tutor.id === enrollment.transaction?.course?.tutorId) {
                            const updatedTutorWallet = {
                                balance: tutor?.account?.wallet?.balance + (((enrollment.transaction?.amount / 24000) * 20) / 100),
                                accountId: tutor.accountId,
                            };
                            console.log(updatedTutorWallet.balance)
                            await walletService.updateWallet(tutor.account?.wallet?.id, updatedTutorWallet);

                            const tutorWalletHistory = {
                                walletId: tutor.account?.wallet?.id,
                                note: `+${((enrollment.transaction?.amount / 24000) * 20) / 100}$ from MeowLish for your course ${enrollment.transaction?.course?.name} at ${currentDate.toLocaleString()}`, // Changed currentDateTime to currentDate
                            };

                            await walletHistoryService.saveWalletHistory(tutorWalletHistory);
                        }
                    }
                }
            }
        });

    }, []);


    //TRANSFER

    //tutor
    const [showModalTutor, setShowModalTutor] = useState(false);
    const [totalAmountTutor, setTotalAmountTutor] = useState(0);
    const [amountToTransfer, setAmountToTransfer] = useState(0);

    const [account, setAccount] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        imageUrl: "",
        gender: ""
    });


    const openModalTutor = (accountId, tutorId) => {
        setShowModalTutor(true);
        if (accountId) {
            accountService
                .getAccountById(accountId)
                .then((res) => {
                    setAccount(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        tutorService.getTotalAmountByTutor(tutorId)
            .then((res) => {
                setTotalAmountTutor(res.data);
                setAmountToTransfer(res.data * 0.8);
            })
    };

    const closeModalTutor = () => {
        setShowModalTutor(false);
    };

    const submitWalletTutor = async (e) => {
        e.preventDefault();
        const amount = parseFloat(e.target.amount.value * 0.8); // Capture the amount from the input field

        try {
            const adminWallet = { // Use object syntax {} instead of array syntax []
                id: wallet.id,
                balance: wallet.balance - amount,
                accountId: wallet.accountId
            };
            console.log(JSON.stringify(adminWallet))

            await walletService.updateWallet(adminWallet.id, adminWallet);

            const walletHistory = { // Similarly, use object syntax {} here
                transactionDate: currentDateTime,
                walletId: adminWallet.id,
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
                note: `+ ${amount}$ for receiving salary from MeowLish at ${currentDateTime}`

            };
            await walletHistoryService.saveWalletHistory(walletHistoryTutor);

            closeModalTutor();
            window.alert("Transfer successfully!");

            // Reload the page
            window.location.reload();

        } catch (error) {
            console.log(error);
        }
    };

    //center
    const [showModalCenter, setShowModalCenter] = useState(false);
    const [totalAmountCenter, setTotalAmountCenter] = useState(0);

    const [center, setCenter] = useState({
        email: "",
        name: "",
        phoneNumber: "",
        taxIdentificationNumber: "",
        description: ""
    });

    const openModalCenter = (centerId) => {
        setShowModalCenter(true);
        if (centerId) {
            centerService
                .getCenterById(centerId)
                .then((res) => {
                    setCenter(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        centerService.getTotalAmountByCenter(centerId)
            .then((res) => {
                setTotalAmountCenter(res.data);
                setAmountToTransfer(res.data * 0.8);
            })
    };

    const closeModalCenter = () => {
        setShowModalCenter(false);
    };

    const submitWalletCenter = async (e) => {
        e.preventDefault();
        const amount = parseFloat(e.target.amount.value * 0.8); // Capture the amount from the input field

        try {
            const adminWallet = { // Use object syntax {} instead of array syntax []
                id: wallet.id,
                balance: wallet.balance - amount,
                accountId: wallet.accountId
            };
            console.log(JSON.stringify(adminWallet))

            await walletService.updateWallet(adminWallet.id, adminWallet);

            const walletHistory = { // Similarly, use object syntax {} here
                transactionDate: currentDateTime,
                walletId: adminWallet.id,
                note: `- ${amount}$ for transfering to center ${center.name} at ${currentDateTime}`
            };
            await walletHistoryService.saveWalletHistory(walletHistory);


            const centerWallet = {
                id: center.account?.wallet?.id,
                balance: center.account?.wallet?.balance + amount,
                accountId: center.accountId
            };
            console.log(JSON.stringify(centerWallet))

            await walletService.updateWallet(centerWallet.id, centerWallet);

            const walletHistoryCenter = {
                transactionDate: currentDateTime,
                walletId: centerWallet.id,
                note: `+ ${amount}$ for receiving salary from MeowLish at ${currentDateTime}`

            };
            await walletHistoryService.saveWalletHistory(walletHistoryCenter);

            closeModalTutor();
            window.alert("Transfer successfully!");

            // Reload the page
            window.location.reload();

        } catch (error) {
            console.log(error);
        }
    };
    //staff
    const [showModalStaff, setShowModalStaff] = useState(false);
    const [totalAmountStaff, setTotalAmountStaff] = useState(0);

    const openModalStaff = (accountId, staffId) => {
        setShowModalStaff(true);
        if (accountId) {
            accountService
                .getAccountById(accountId)
                .then((res) => {
                    setAccount(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }


    };

    const closeModalStaff = () => {
        setShowModalStaff(false);
    };

    const submitWalletStaff = async (e) => {
        e.preventDefault();
        const amount = parseFloat(e.target.amount.value); // Capture the amount from the input field

        try {
            const adminWallet = { // Use object syntax {} instead of array syntax []
                id: wallet.id,
                balance: wallet.balance - amount,
                accountId: wallet.accountId
            };
            console.log(JSON.stringify(adminWallet))

            await walletService.updateWallet(adminWallet.id, adminWallet);

            const walletHistory = { // Similarly, use object syntax {} here
                transactionDate: currentDateTime,
                walletId: adminWallet.id,
                note: `- ${amount}$ for transfering to staff ${account.fullName} at ${currentDateTime}`
            };
            await walletHistoryService.saveWalletHistory(walletHistory);


            const staffWallet = {
                id: account.wallet?.id,
                balance: account.wallet?.balance + amount,
                accountId: account.id
            };
            console.log(JSON.stringify(staffWallet))

            await walletService.updateWallet(staffWallet.id, staffWallet);

            const walletHistoryStaff = {
                transactionDate: currentDateTime,
                walletId: staffWallet.id,
                note: `+ ${amount}$ for receiving salary from MeowLish at ${currentDateTime}`

            };
            await walletHistoryService.saveWalletHistory(walletHistoryStaff);

            closeModalTutor();
            window.alert("Transfer successfully!");

            // Reload the page
            window.location.reload();

        } catch (error) {
            console.log(error);
        }
    };
    //TRANSFER



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
                                    <label htmlFor="transactionId">Center Information:</label>

                                    <div className="table-responsive">
                                        <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                            <thead className="thead-light">
                                                <tr>
                                                    <th data-toggle="true">No.</th>
                                                    <th data-toggle="true">Center Name</th>
                                                    <th>Email</th>
                                                    <th data-hide="phone">Description</th>
                                                    <th data-hide="phone, tablet">Address</th>
                                                    <th>Managed By</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    currentCenters.length > 0 && currentCenters.map((cus, index) => (
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
                                                                <button className='btn btn-success' onClick={() => openModalCenter(cus.id)} style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                                                    Transfer
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }

                                            </tbody>


                                        </table>

                                    </div> {/* end .table-responsive*/}
                                    {
                                        currentCenters.length === 0 && (
                                            <p className='text-center'>There are no centers.</p>
                                        )
                                    }
                                    {showModalCenter && (
                                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                            <div className="modal-dialog" role="document">
                                                <div className="modal-content">
                                                    <form onSubmit={submitWalletCenter}>

                                                        <div className="modal-header">
                                                            <h5 className="modal-title">Your balance: ${wallet.balance}</h5>
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalCenter}>
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body">

                                                            <div className='row'>
                                                                <div className="col-md-12">
                                                                    <table className="table table-responsive table-hover ">
                                                                        <tbody>
                                                                            <tr>
                                                                                <th style={{ width: '30%' }}>Name:</th>
                                                                                <td>{center.name}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Email:</th>
                                                                                <td>{center.email}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Phone Number:</th>
                                                                                <td>{center && center.phoneNumber ? center.phoneNumber : 'Unknown Phone Number'}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Address:</th>
                                                                                <td>{center && center.address ? center.address : 'Unknown Address'}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Tax Code:</th>
                                                                                <td>{center && center.taxIdentificationNumber ? center.taxIdentificationNumber : 'Unknown Tax Code'}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Description:</th>
                                                                                <td>{center && center.description ? center.description : 'Unknown Description'}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <h4>Revenue this month: ${totalAmountCenter}</h4>
                                                                    <p>Amount to transfer: ${totalAmountCenter} x 80% = ${amountToTransfer}</p>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <input type='hidden' name='amount' value={totalAmountCenter} className='form-control' />
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="modal-footer">
                                                            {
                                                                wallet.balance > totalAmountCenter && (
                                                                    <button type="submit" className="btn btn-warning" style={{ borderRadius: '50px', padding: `8px 25px` }}>Transfer</button>
                                                                )
                                                            }
                                                            <button type="button" className="btn btn-dark" onClick={closeModalCenter} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                                        </div>
                                                    </form>

                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                                                {
                                                    currentStaffs.length > 0 && currentStaffs.map((cus, index) => (

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
                                                                <button className='btn btn-success' onClick={() => openModalStaff(cus.account?.id, cus.id)} style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                                                    Transfer
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }

                                            </tbody>
                                            {
                                                currentStaffs.length === 0 && (
                                                    <p className='text-center'>There are no staffs.</p>
                                                )
                                            }
                                        </table>
                                    </div> {/* end .table-responsive*/}
                                    {showModalStaff && (
                                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                            <div className="modal-dialog" role="document">
                                                <div className="modal-content">
                                                    <form onSubmit={submitWalletStaff}>

                                                        <div className="modal-header">
                                                            <h5 className="modal-title">Your balance: ${wallet.balance}</h5>
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalStaff}>
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
                                                                    <input type='number' name='amount' placeholder='Enter the amount' className='form-control' style={{ borderRadius: '50px', padding: `8px 25px` }}/>                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="modal-footer">
                                                            {
                                                                wallet.balance > totalAmountTutor && (
                                                                    <button type="submit" className="btn btn-warning" style={{ borderRadius: '50px', padding: `8px 25px` }}>Transfer</button>
                                                                )
                                                            }
                                                            <button type="button" className="btn btn-dark" onClick={closeModalStaff} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
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
                                    <label htmlFor="transactionId" >Tutor Freelancer Information:</label>
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
                                                {
                                                    currentTutors.length > 0 && currentTutors.map((cus, index) => (

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
                                                                <Link to={`/edit-tutor/${cus.account.id}`} className='text-secondary'>
                                                                    <i class="fa-regular fa-eye"></i>
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                <button className='btn btn-success' onClick={() => openModalTutor(cus.account?.id, cus.id)} style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                                                    Transfer
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }

                                            </tbody>
                                            {
                                                currentTutors.length === 0 && (
                                                    <p className='text-center'>There are no tutor freelancers.</p>
                                                )
                                            }
                                        </table>
                                    </div> {/* end .table-responsive*/}
                                </div> {/* end card-box*/}
                                {showModalTutor && (
                                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <form onSubmit={submitWalletTutor}>

                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Your balance: ${wallet.balance}</h5>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalTutor}>
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
                                                                <h4>Revenue this month: ${totalAmountTutor}</h4>
                                                                <p>Amount to transfer: ${totalAmountTutor} x 80% = ${amountToTransfer}</p>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <input type='hidden' name='amount' value={totalAmountTutor} className='form-control' />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="modal-footer">
                                                        {
                                                            wallet.balance > totalAmountTutor && (
                                                                <button type="submit" className="btn btn-warning" style={{ borderRadius: '50px', padding: `8px 25px` }}>Transfer</button>
                                                            )
                                                        }
                                                        <button type="button" className="btn btn-dark" onClick={closeModalTutor} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
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
                `}
            </style>
        </>
    )
}

export default MyWallet;
