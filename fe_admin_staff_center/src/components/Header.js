import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import accountService from '../services/account.service';
import walletHistoryService from '../services/wallet-history.service';
import walletService from '../services/wallet.service';
import Dropzone from "react-dropzone";
import centerService from '../services/center.service';

const Header = () => {

    const accountId = sessionStorage.getItem('accountId');
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const isStaff = sessionStorage.getItem('isStaff') === 'true';
    const isCenter = sessionStorage.getItem('isCenter') === 'true';


    const navigate = useNavigate();
    // Modal state
    const [showModal, setShowModal] = useState(false);

    const [editMode, setEditMode] = useState(false); // State to manage edit mode

    const [account, setAccount] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        imageUrl: "",
        gender: false
    });
    const [center, setCenter] = useState({
        email: "",
        name: "",
        phoneNumber: "",
        taxIdentificationNumber: "",
        description: ""
    });


    useEffect(() => {
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
    }, [accountId]);

    const storedCenterId = sessionStorage.getItem('centerId');
    useEffect(() => {
        if (storedCenterId) {
            centerService
                .getCenterById(storedCenterId)
                .then((res) => {
                    setCenter(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [storedCenterId]);

    const handleLogout = () => {
        // Clear user session or perform any necessary logout actions
        // For example, you can use localStorage or sessionStorage to store authentication status
        sessionStorage.removeItem('authToken'); // Assuming you store authentication token in localStorage
        sessionStorage.removeItem('accountId');
        sessionStorage.removeItem('isLearner');
        sessionStorage.removeItem('isTutor');
        sessionStorage.removeItem('learnerId'); // Assuming you store authentication token in localStorage
        sessionStorage.removeItem('tutorId'); // Assuming you store authentication token in localStorage
        sessionStorage.removeItem('token'); // Assuming you store authentication token in localStorage
        sessionStorage.removeItem('isLoggedIn');

        // Redirect to the login page or any other page after logout
        navigate('/login');
    };

    useEffect(() => {
        const handleBackwardNavigation = () => {
            // Redirect users to a specific page when they try to go back
            navigate('/prevent-back');
        };

        window.addEventListener('popstate', handleBackwardNavigation);

        return () => {
            window.removeEventListener('popstate', handleBackwardNavigation);
        };
    }, [navigate]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false)
    };

    //edit account
    // Toggle edit mode
    const toggleEditMode = () => {
        setEditMode(!editMode);
    };



    //WALLET HISTORY
    const [walletHistoryList, setWalletHistoryList] = useState([]);

    useEffect(() => {
        walletService
            .getAllWalletHistoryByWallet(account.wallet?.id)
            .then((res) => {
                const filteredHistoryList = res.data;
                // Sort refundList by requestedDate
                const sortedHistoryList = [...filteredHistoryList].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.transactionDate) - new Date(a.transactionDate);
                });

                setWalletHistoryList(sortedHistoryList);
            })
            .catch((error) => {
                // console.log(error);
            });
    }, [account.wallet?.id]);

    const [showWalletHistoryModal, setShowWalletHistoryModal] = useState(false);

    const openWalletHistoryModal = () => {
        setShowWalletHistoryModal(true);
    };

    const closeWalletHistoryModal = () => {
        setShowWalletHistoryModal(false);
    };

    //UPDATE ACCOUNT
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const handleFileDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);

            // Set the image preview URL
            const previewUrl = URL.createObjectURL(acceptedFiles[0]);
            setImagePreview(previewUrl);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setAccount({ ...account, [e.target.name]: value });
    };


    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (!account || !account.fullName || account.fullName.trim() === '') {
            errors.fullName = 'Name is required';
            isValid = false;
        }

        if (!account || !account.address || account.address.trim() === '') {
            errors.address = 'Address is required';
            isValid = false;
        }

        if (!account || !account.phoneNumber || account.phoneNumber.trim() === '') {
            errors.phoneNumber = 'Phone Number is required';
            isValid = false;
        } else if (!account || !account.phoneNumber || !/^\d{10}$/.test(account.phoneNumber.trim())) {
            errors.phoneNumber = 'Phone Number must be exactly 10 digits';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const submitAccount = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            let imageUrl = account.imageUrl; // Keep the existing imageUrl if available

            if (file) {
                try {
                    // Upload image and get the link
                    const imageData = new FormData();
                    imageData.append("file", file);
                    const imageResponse = await accountService.uploadImage(imageData);

                    // Update the imageUrl with the link obtained from the API
                    imageUrl = imageResponse.data;

                    // Log the imageUrl after updating
                    console.log("this is url: " + imageUrl);
                } catch (error) {
                    console.error("Error uploading image:", error);
                    // Handle image upload error here, show appropriate feedback to the user
                    return;
                }
            }

            // Convert gender string to boolean if needed
            if (account.gender === "male") {
                account.gender = true;
            } else if (account.gender === "female") {
                account.gender = false;
            }

            // Update account data
            const accountData = { ...account, imageUrl };

            try {
                const res = await accountService.updateAccount(account.id, accountData);
                console.log("Update Account Successfully:", res.data);
                window.alert("Update Account Successfully");
                // Assuming you have a state management system, update account details in the state here instead of reloading the page
                window.location.reload();
            } catch (error) {
                console.error("Error updating account:", error);
                // Handle account update error here, show appropriate feedback to the user
            }
        }
    };

    //UPDATE ACCOUNT


    //DEPOSIT
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    const openWithdrawModal = () => {
        setShowWithdrawModal(true);
    };

    const closeWithdrawModal = () => {
        setShowWithdrawModal(false);
    };

    const [selectedAmount, setSelectedAmount] = useState(null);
    const handleAmountChange = (event) => {
        const value = parseFloat(event.target.value);
        if (value <= account.wallet?.balance) {
            setSelectedAmount(value);
        } else {
            window.alert(`The selected amount exceeds your wallet balance of $${account.wallet?.balance}`);
        }
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

    const submitWithdraw = async (event) => {
        event.preventDefault();

        if (!selectedAmount) {
            console.log("Please select an amount.");
            return;
        }

        const amount = parseFloat(selectedAmount); // Capture the selected amount

        try {
            const withdrawWallet = {
                id: account.wallet?.id,
                balance: account.wallet?.balance - amount,
                accountId: account.id
            };
            console.log(JSON.stringify(withdrawWallet))

            await walletService.updateWallet(withdrawWallet.id, withdrawWallet);

            const walletHistoryWithdraw = {
                transactionDate: currentDateTime,
                walletId: withdrawWallet.id,
                note: `- ${amount}$ for withdrawing balance at ${currentDateTime}`
            };
            await walletHistoryService.saveWalletHistory(walletHistoryWithdraw);

            window.alert("Withdraw successfully!");

            // Reload the page
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {/* Topbar Start */}
            <div className="navbar-custom" style={{ backgroundColor: '#242732' }}>
                <div className="container-fluid">
                    <ul className="list-unstyled topnav-menu float-right mb-0">

                        <li className="dropdown notification-list topbar-dropdown">
                            <a className="nav-link dropdown-toggle nav-user mr-0 waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                {isAdmin && (
                                    <img src={account.imageUrl} alt="user-image" className="rounded-circle" />
                                )}
                                {isStaff && (
                                    <img src={account.imageUrl} alt="user-image" className="rounded-circle" />
                                )}

                                {isCenter && (
                                    <img src={account.imageUrl} alt="user-image" className="rounded-circle" />

                                )}
                            </a>
                            <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
                                {/* item*/}
                                <div className="dropdown-header noti-title">
                                    {isAdmin && (
                                        <>
                                            <h6 className="text-overflow m-0">Welcome {account.fullName}!</h6>
                                            <p>Balance: ${account.wallet?.balance} <i class="far fa-eye" onClick={openWalletHistoryModal}></i></p>
                                        </>
                                    )}


                                    {isStaff && (
                                        <>
                                            <h6 className="text-overflow m-0">Welcome {account.fullName}!</h6>
                                            <p>Balance: ${account.wallet?.balance} <i class="far fa-eye" onClick={openWalletHistoryModal}></i>
                                                <i class="fas fa-funnel-dollar text-danger" onClick={openWithdrawModal}></i>
                                            </p>

                                        </>
                                    )}

                                    {isCenter && (
                                        <>
                                            <h6 className="text-overflow m-0">Welcome {account.fullName}!</h6>
                                            <p>Balance: ${account.wallet?.balance} <i class="far fa-eye" onClick={openWalletHistoryModal}></i>
                                                <i class="fas fa-funnel-dollar text-danger" onClick={openWithdrawModal}></i>
                                            </p>

                                        </>

                                    )}
                                </div>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item" onClick={openModal} style={{ marginTop: '-30px' }}>
                                    <i className="fe-user" />
                                    <span>My Account</span>
                                </a>
                                <div className="dropdown-divider" />
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item" onClick={handleLogout}>
                                    <i className="fe-log-out" />
                                    <span>Logout</span>
                                </a>
                            </div>
                        </li>
                        {/* <li className="dropdown notification-list">
                            <a href="javascript:void(0);" className="nav-link right-bar-toggle waves-effect waves-light">
                                <i className="fe-settings noti-icon" />
                            </a>
                        </li> */}
                    </ul>
                    {/* LOGO */}
                    <div className="logo-box">
                        <Link className="logo logo-light text-center">
                            <span style={{ fontFamily: 'Comic Sans MS', fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                                MEOWLISH
                            </span>
                        </Link>
                    </div>


                    <div className="clearfix" />
                </div>
            </div>
            {/* end Topbar */}
            {/* My Account Modal */}
            {
                isAdmin && (
                    showModal && (
                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">My Account</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    {/* Conditional rendering based on edit mode */}
                                    {editMode ? (
                                        <>
                                            <form onSubmit={(e) => submitAccount(e)}>
                                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}
                                                    {/* Input fields for editing */}
                                                    <label htmlFor="imageUrl">
                                                        <img src={account.imageUrl} alt="avatar" className="rounded-circle" style={{ width: '30%', cursor: 'pointer' }} />
                                                    </label>
                                                    <Dropzone
                                                        onDrop={handleFileDrop}
                                                        accept="image/*"
                                                        multiple={false}
                                                        maxSize={5000000} // Maximum file size (5MB)

                                                    >
                                                        {({ getRootProps, getInputProps }) => (
                                                            <div {...getRootProps()} className="fallback">
                                                                <input {...getInputProps()} />
                                                                <div className="dz-message needsclick">
                                                                    <i className="h1 text-muted dripicons-cloud-upload" />
                                                                </div>
                                                                {imagePreview && (
                                                                    <img
                                                                        src={imagePreview}
                                                                        alt="Preview"
                                                                        style={{
                                                                            width: '30%', cursor: 'pointer'
                                                                        }}
                                                                        className='rounded-circle'
                                                                    />
                                                                )}
                                                            </div>

                                                        )}
                                                    </Dropzone>

                                                    <div className="table-responsive">
                                                        <table className="table table-hover mt-3">
                                                            <tbody>
                                                                <tr>
                                                                    <th style={{ width: '30%' }}>Full Name:</th>
                                                                    <td>
                                                                        <input type="text" className="form-control" name="fullName" value={account.fullName} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                        {errors.fullName && <p className="text-danger">{errors.fullName}</p>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Phone Number:</th>
                                                                    <td>
                                                                        <input type="number" className="form-control" name="phoneNumber" value={account.phoneNumber} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                        {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber}</p>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Address:</th>
                                                                    <td>
                                                                        <input type="text" className="form-control" name="address" value={account.address} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                        {errors.address && <p className="text-danger">{errors.address}</p>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Gender:</th>
                                                                    <td>
                                                                        <select className="form-control" name="gender" value={account.gender} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                                                            <option value="male">Male</option>
                                                                            <option value="female">Female</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>Save Changes</button>
                                                    <button type="button" className="btn btn-dark" onClick={closeModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                                </div>
                                            </form>
                                        </>


                                    ) : (
                                        <>
                                            <div className="modal-body">

                                                <img src={account.imageUrl} alt="avatar" className="rounded-circle" style={{ width: '30%' }} />

                                                <div>
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
                                                                <th>Address:</th>
                                                                <td>{account && account.address ? account.address : 'Unknown Address'}</td>
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

                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-warning" onClick={toggleEditMode} style={{ borderRadius: '50px', padding: `8px 25px` }}>Edit</button>
                                                <button type="button" className="btn btn-dark" onClick={closeModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                            </div>
                                        </>

                                    )}

                                </div>
                            </div>
                        </div>
                    )
                )
            }
            {
                isStaff && (
                    showModal && (
                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">My Account</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    {/* Conditional rendering based on edit mode */}
                                    {editMode ? (
                                        <>
                                            <form onSubmit={(e) => submitAccount(e)}>
                                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}
                                                    {/* Input fields for editing */}
                                                    <label htmlFor="imageUrl">
                                                        <img src={account.imageUrl} alt="avatar" className="rounded-circle" style={{ width: '30%', cursor: 'pointer' }} />
                                                    </label>
                                                    <Dropzone
                                                        onDrop={handleFileDrop}
                                                        accept="image/*"
                                                        multiple={false}
                                                        maxSize={5000000} // Maximum file size (5MB)

                                                    >
                                                        {({ getRootProps, getInputProps }) => (
                                                            <div {...getRootProps()} className="fallback">
                                                                <input {...getInputProps()} />
                                                                <div className="dz-message needsclick">
                                                                    <i className="h1 text-muted dripicons-cloud-upload" />
                                                                </div>
                                                                {imagePreview && (
                                                                    <img
                                                                        src={imagePreview}
                                                                        alt="Preview"
                                                                        style={{
                                                                            width: '30%', cursor: 'pointer'
                                                                        }}
                                                                        className='rounded-circle'
                                                                    />
                                                                )}
                                                            </div>

                                                        )}
                                                    </Dropzone>

                                                    <div className="table-responsive">
                                                        <table className="table table-hover mt-3">
                                                            <tbody>
                                                                <tr>
                                                                    <th style={{ width: '30%' }}>Full Name:</th>
                                                                    <td>
                                                                        <input type="text" className="form-control" name="fullName" value={account.fullName} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                        {errors.fullName && <p className="text-danger">{errors.fullName}</p>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Phone Number:</th>
                                                                    <td>
                                                                        <input type="number" className="form-control" name="phoneNumber" value={account.phoneNumber} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                        {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber}</p>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Address:</th>
                                                                    <td>
                                                                        <input type="text" className="form-control" name="address" value={account.address} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                        {errors.address && <p className="text-danger">{errors.address}</p>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Gender:</th>
                                                                    <td>
                                                                        <select className="form-control" name="gender" value={account.gender} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                                                            <option value="male">Male</option>
                                                                            <option value="female">Female</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>Save Changes</button>
                                                    <button type="button" className="btn btn-dark" onClick={closeModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                                </div>
                                            </form>
                                        </>


                                    ) : (
                                        <>
                                            <div className="modal-body">

                                                <img src={account.imageUrl} alt="avatar" className="rounded-circle" style={{ width: '30%' }} />

                                                <div>
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
                                                                <th>Address:</th>
                                                                <td>{account && account.address ? account.address : 'Unknown Address'}</td>
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

                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-warning" onClick={toggleEditMode} style={{ borderRadius: '50px', padding: `8px 25px` }}>Edit</button>
                                                <button type="button" className="btn btn-dark" onClick={closeModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                            </div>
                                        </>

                                    )}

                                </div>
                            </div>
                        </div>
                    )
                )
            }
            {
                isCenter && (
                    showModal && (
                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Center Information</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    {/* Conditional rendering based on edit mode */}
                                    {editMode ? (
                                        <>
                                            <form onSubmit={(e) => submitAccount(e)}>
                                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Added style for scrolling */}
                                                    {/* Input fields for editing */}
                                                    <label htmlFor="imageUrl">
                                                        <img src={account.imageUrl} alt="avatar" className="rounded-circle" style={{ width: '30%', cursor: 'pointer' }} />
                                                    </label>
                                                    <Dropzone
                                                        onDrop={handleFileDrop}
                                                        accept="image/*"
                                                        multiple={false}
                                                        maxSize={5000000} // Maximum file size (5MB)

                                                    >
                                                        {({ getRootProps, getInputProps }) => (
                                                            <div {...getRootProps()} className="fallback">
                                                                <input {...getInputProps()} />
                                                                <div className="dz-message needsclick">
                                                                    <i className="h1 text-muted dripicons-cloud-upload" />
                                                                </div>
                                                                {imagePreview && (
                                                                    <img
                                                                        src={imagePreview}
                                                                        alt="Preview"
                                                                        style={{
                                                                            width: '30%', cursor: 'pointer'
                                                                        }}
                                                                        className='rounded-circle'
                                                                    />
                                                                )}
                                                            </div>

                                                        )}
                                                    </Dropzone>

                                                    <div className="table-responsive">
                                                        <table className="table table-hover mt-3">
                                                            <tbody>
                                                                <tr>
                                                                    <th style={{ width: '30%' }}>Full Name:</th>
                                                                    <td>
                                                                        <input type="text" className="form-control" name="fullName" value={account.fullName} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                        {errors.fullName && <p className="text-danger">{errors.fullName}</p>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Phone Number:</th>
                                                                    <td>
                                                                        <input type="number" className="form-control" name="phoneNumber" value={account.phoneNumber} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                        {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber}</p>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Address:</th>
                                                                    <td>
                                                                        <input type="text" className="form-control" name="address" value={account.address} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }} />
                                                                        {errors.address && <p className="text-danger">{errors.address}</p>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Gender:</th>
                                                                    <td>
                                                                        <select className="form-control" name="gender" value={account.gender} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}>
                                                                            <option value="male">Male</option>
                                                                            <option value="female">Female</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="submit" className="btn btn-success" style={{ borderRadius: '50px', padding: `8px 25px` }}>Save Changes</button>
                                                    <button type="button" className="btn btn-dark" onClick={closeModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                                </div>
                                            </form>
                                        </>


                                    ) : (
                                        <>
                                            <div className="modal-body">
                                                <div>
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
                                                                <td style={{ textAlign: 'left' }}>{center && center.description ? center.description : 'Unknown Description'}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-dark" onClick={closeModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                            </div>
                                        </>

                                    )}

                                </div>
                            </div>
                        </div>
                    )
                )
            }
            {
                showWalletHistoryModal && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document"> {/* Added modal-lg class */}
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Wallet History</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeWalletHistoryModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {/* Conditional rendering based on edit mode */}
                                    <div>
                                        {/* Input fields for editing */}
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Transaction Date</th>
                                                        <th>Note</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        walletHistoryList.length > 0 && walletHistoryList.map((walletHistory, index) => (
                                                            <tr key={walletHistory.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{new Date(walletHistory.transactionDate).toLocaleString('en-US')}</td>
                                                                <td>{walletHistory.note}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                {
                                    walletHistoryList.length === 0 && (
                                        <p className='text-center'>No histories found.</p>
                                    )
                                }
                                <div className="modal-footer">
                                    {/* Conditional rendering of buttons based on edit mode */}
                                    <button type="button" className="btn btn-dark" onClick={closeWalletHistoryModal} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                showWithdrawModal && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Withdraw</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeWithdrawModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <form onSubmit={submitWithdraw}>
                                    <div className="modal-body">
                                        <div>
                                            <h3>Enter the amount you want to withdraw:</h3>
                                            <input className='form-control' placeholder='USD accepted' type='number' name='amount' style={{ borderRadius: '50px', padding: `8px 25px` }} onChange={handleAmountChange}/>
                                            <p>Powered by <img src={process.env.PUBLIC_URL + '/logo-vnpay.png'} alt="VnPay Logo" style={{ width: '10%', marginTop: '20px' }} /></p>
                                            <div className="game-options-container">
                                                {[100, 200, 300, 400, 500].map((amount) => (
                                                    <span className='span1' key={amount}>
                                                        <input
                                                            type="radio"
                                                            name="amount"
                                                            className="radio"
                                                            value={amount}
                                                            id={`amount-${amount}`}
                                                            onChange={handleAmountChange}
                                                        />
                                                        <label
                                                            htmlFor={`amount-${amount}`}
                                                            className={`option ${selectedAmount == amount ? "selected" : ""}`}
                                                        >
                                                            ${amount}
                                                        </label>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer" style={{ marginTop: '100px' }}>
                                        {
                                            account.wallet?.balance > 0 ? (
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-lg btn-block"
                                                    style={{ backgroundColor: '#f58d04', borderRadius: '50px', padding: `8px 25px` }}
                                                >
                                                    Continue
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="btn btn-primary btn-lg btn-block"
                                                    style={{ backgroundColor: '#f58d04', borderRadius: '50px', padding: `8px 25px` }}
                                                >
                                                    Your balance is not enough to withdraw right now!
                                                </button>
                                            )
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }




            <style>
                {`
                
                .module-title:hover {
                    background-color: #333;
                    color: #fff;
                    cursor: pointer;
                }
                
                .module-list li:hover {
                    background-color: #f0f0f0;
                    cursor: pointer;
                }
                
                .card.module-title {
    background-color: #FFF0D6; /* Darker background color */
    color: #000; /* White text color */
    transition: background-color 0.3s ease; /* Smooth transition effect */
}

.card.module-title:hover {
    background-color: #E7E3DC; /* Darker background color on hover */
    color: #fff
}
.game-options-container{
    width: 100%;
    height: 12rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
}

.game-options-container span{
    width: 45%;
    height: 3rem;
    border: 2px solid darkgray;
    border-radius: 20px;
    overflow: hidden;
}
span label{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s;
    font-weight: 600;
    color: rgb(22, 22, 22);
}


.span1 label:hover{
    -ms-transform: scale(1.12);
    -webkit-transform: scale(1.12);
    transform: scale(1.12);
    color: #f58d04;
    background-color: #FFF0D6
}

input[type="radio"] {
    position: relative;
    display: none;
}



.next-button-container{
    width: 50%;
    height: 3rem;
    display: flex;
    justify-content: center;
}
.next-button-container button{
    width: 8rem;
    height: 2rem;
    border-radius: 10px;
    background: none;
    color: rgb(25, 25, 25);
    font-weight: 600;
    border: 2px solid gray;
    cursor: pointer;
    outline: none;
}
.next-button-container button:hover{
    background-color: rgb(143, 93, 93);
}

.modal-container{
    display: none;
    position: fixed;
    z-index: 1; 
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgb(0,0,0); 
    background-color: rgba(0,0,0,0.4); 
    flex-direction: column;
    align-items: center;
    justify-content: center; 
    -webkit-animation: fadeIn 1.2s ease-in-out;
    animation: fadeIn 1.2s ease-in-out;
}

.modal-content-container{
    height: 20rem;
    width: 25rem;
    background-color: rgb(43, 42, 42);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border-radius: 25px;
}

.modal-content-container h1{
    font-size: 1.3rem;
    height: 3rem;
    color: lightgray;
    text-align: center;
}

.grade-details{
    width: 15rem;
    height: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}

.grade-details p{
    color: white;
    text-align: center;
}

.modal-button-container{
    height: 2rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-button-container button{
    width: 10rem;
    height: 2rem;
    background: none;
    outline: none;
    border: 1px solid rgb(252, 242, 241);
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 20px;
}
.modal-button-container button:hover{
    background-color: rgb(83, 82, 82);
}

@media(min-width : 300px) and (max-width : 350px){
    .game-quiz-container{
        width: 90%;
        height: 80vh;
     }
     .game-details-container h1{
        font-size: 0.8rem;
     }

     .game-question-container{
        height: 6rem;
     }
     .game-question-container h1{
       font-size: 0.9rem;
    }

    .game-options-container span{
        width: 90%;
        height: 2.5rem;
    }
    .game-options-container span label{
        font-size: 0.8rem;
    }
    .modal-content-container{
        width: 90%;
        height: 25rem;
    }

    .modal-content-container h1{
        font-size: 1.2rem;
    }
}
.correct-answer {
    background-color: green;
}

.incorrect-answer {
    background-color: red;
}
.fixed-course-name {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    background-color: #333;
    padding: 10px 0;
}

.iitem {
    transition: transform 0.3s ease;
}

.iitem:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.truncate-text {
    max-width: 200px; /* Adjust max-width as needed */
    overflow: hidden;
    text-overflow: ellipsis;
}
.option.selected {
    color: #f58d04; // Change the color to your desired color
    background-color: #FFF0D6; // Change the background color to your desired color
}

.game-options-container span input[type="radio"]:checked + label {
    background-color: #f58d04; /* Change to your desired color */
    color: #fff; /* Change to your desired text color */
}

  
            `}
            </style>
        </>
    )
}

export default Header