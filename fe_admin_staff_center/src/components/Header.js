import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import accountService from '../services/account.service';
import walletHistoryService from '../services/wallet-history.service';
import walletService from '../services/wallet.service';
import Dropzone from "react-dropzone";
import centerService from '../services/center.service';

const Header = () => {

    const accountId = localStorage.getItem('accountId');
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
        gender: ""
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

    const storedCenterId = localStorage.getItem('centerId');
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
        localStorage.removeItem('authToken'); // Assuming you store authentication token in localStorage

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

        if (account.fullName.trim() === '') {
            errors.fullName = 'Name is required';
            isValid = false;
        }

        if (account.address.trim() === '') {
            errors.address = 'Address is required';
            isValid = false;
        }

        if (account.phoneNumber.trim() === '') {
            errors.phoneNumber = 'Phone Number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(account.phoneNumber.trim())) {
            errors.phoneNumber = 'Phone Number must be exactly 10 digits';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const submitAccount = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Save account
            let imageUrl = account.imageUrl; // Keep the existing imageUrl if available

            if (file) {
                // Upload image and get the link
                const imageData = new FormData();
                imageData.append("file", file);
                const imageResponse = await accountService.uploadImage(imageData);

                // Update the imageUrl with the link obtained from the API
                let imageUrl = imageResponse.data;

                // Log the imageUrl after updating
                console.log("this is url: " + imageUrl);
                account.imageUrl = imageResponse.data;
            }

            // Update account
            const accountData = { ...account, imageUrl }; // Create a new object with updated imageUrl
            console.log(JSON.stringify(accountData))

            accountService
                .updateAccount(account.id, account)
                .then((res) => {
                    window.alert("Update Account Successfully");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    //UPDATE ACCOUNT


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
                                            <p>Balance: {account.wallet?.balance} <i class="far fa-eye" onClick={openWalletHistoryModal}></i></p>
                                        </>
                                    )}


                                    {isStaff && (
                                        <>
                                            <h6 className="text-overflow m-0">Welcome {account.fullName}!</h6>
                                            <p>Balance: {account.wallet?.balance} <i class="far fa-eye" onClick={openWalletHistoryModal}></i></p>

                                        </>
                                    )}

                                    {isCenter && (
                                        <>
                                            <h6 className="text-overflow m-0">Welcome {account.fullName}!</h6>
                                            <p>Balance: {account.wallet?.balance} <i class="far fa-eye" onClick={openWalletHistoryModal}></i></p>

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
                isAdmin  && (
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
                                                                        <input type="text" className="form-control" name="fullName" value={account.fullName} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}/>
                                                                        {errors.fullName && <p className="text-danger">{errors.fullName}</p>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Phone Number:</th>
                                                                    <td>
                                                                        <input type="number" className="form-control" name="phoneNumber" value={account.phoneNumber} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}/>
                                                                        {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber}</p>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Address:</th>
                                                                    <td>
                                                                        <input type="text" className="form-control" name="address" value={account.address} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}/>
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
                isStaff  && (
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
                                                                        <input type="text" className="form-control" name="fullName" value={account.fullName} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}/>
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
                                                                        <input type="text" className="form-control" name="address" value={account.address} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}/>
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
                isCenter  && (
                    showModal && (
                        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                            <div className="modal-dialog" role="document">
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
                                                                        <input type="text" className="form-control" name="fullName" value={account.fullName} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}/>
                                                                        {errors.fullName && <p className="text-danger">{errors.fullName}</p>}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Phone Number:</th>
                                                                    <td>
                                                                        <input type="number" className="form-control" name="phoneNumber" value={account.phoneNumber} onChange={(e) => handleChange(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}/>
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
                                                                <td>{center && center.description ? center.description : 'Unknown Description'}</td>
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
                        <div className="modal-dialog modal-dialog-scrollable" role="document">
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
                                                                <td>{walletHistory.transactionDate}</td>
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

        </>
    )
}

export default Header