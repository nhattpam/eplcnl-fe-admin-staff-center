import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import accountService from '../services/account.service';

const Header = () => {

    const accountId = localStorage.getItem('accountId');
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const isStaff = sessionStorage.getItem('isStaff') === 'true';
    const isCenter = sessionStorage.getItem('isCenter') === 'true';


    const navigate = useNavigate();
    // Modal state
    const [showModal, setShowModal] = useState(false);

    const [editMode, setEditMode] = useState(false); // State to manage edit mode
    const [editedAccount, setEditedAccount] = useState({
        email: "",
        fullName: "",
        phoneNumber: "",
        gender: ""
    });

    const [account, setAccount] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        imageUrl: "",
        gender: ""
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

    // Handle editing account data
    const handleEdit = () => {
        // Perform editing logic here, e.g., send edited data to the server
        console.log("Editing account data:", editedAccount);
        // Close the modal after editing
        closeModal();
    };

    // Update edited account state when input values change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedAccount({ ...editedAccount, [name]: value });
    };
    return (
        <>
            {/* Topbar Start */}
            <div className="navbar-custom" style={{ backgroundColor: '#242732' }}>
                <div className="container-fluid">
                    <ul className="list-unstyled topnav-menu float-right mb-0">
                        <li className="d-none d-lg-block">
                            <form className="app-search">
                                <div className="app-search-box dropdown">
                                    <div className="input-group">
                                        <input type="search" className="form-control" placeholder="Search..." id="top-search" />
                                        <div className="input-group-append">
                                            <button className="btn" type="submit">
                                                <i className="fe-search" />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </li>
                        <li className="dropdown d-inline-block d-lg-none">
                            <a className="nav-link dropdown-toggle arrow-none waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                <i className="fe-search noti-icon" />
                            </a>
                            <div className="dropdown-menu dropdown-lg dropdown-menu-right p-0">
                                <form className="p-3">
                                    <input type="text" className="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                                </form>
                            </div>
                        </li>



                        <li className="dropdown notification-list topbar-dropdown">
                            <a className="nav-link dropdown-toggle nav-user mr-0 waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                {isAdmin && (
                                    <img src={`https://static.thenounproject.com/png/3324336-200.png`} alt="user-image" className="rounded-circle" />
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
                                            <p>Balance: {account.wallet?.balance}</p>
                                        </>
                                    )}


                                    {isStaff && (
                                        <>
                                            <h6 className="text-overflow m-0">Welcome {account.fullName}!</h6>
                                            <p></p>
                                        </>
                                    )}

                                    {isCenter && (
                                        <>
                                            <h6 className="text-overflow m-0">Welcome {account.fullName}!</h6>
                                            <p></p>
                                        </>

                                    )}
                                </div>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item" onClick={openModal} style={{ marginTop: '-30px' }}>
                                    <i className="fe-user" />
                                    <span>My Account</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-settings" />
                                    <span>Settings</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-lock" />
                                    <span>Lock Screen</span>
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
            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">My Account</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Conditional rendering based on edit mode */}
                                {editMode ? (
                                    <div>
                                        {/* Input fields for editing */}
                                        <form>
                                            <img src={account.imageUrl} alt="avatar" className="rounded-circle" style={{ width: '30%' }} />

                                            <div >
                                                <table className="table table-responsive table-hover mt-3">
                                                    <tbody>

                                                        <tr>
                                                            <th style={{ width: '30%' }}>Full Name:</th>
                                                            <td>  <input type="text" className="form-control" id="fullName" name="fullName" value={account.fullName} onChange={handleInputChange} />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Email:</th>
                                                            <td>  <input type="email" className="form-control" id="email" name="email" value={account.email} onChange={handleInputChange} />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Phone Number:</th>
                                                            <td>
                                                                <input type="text" className="form-control" id="phoneNumber" name="phoneNumber" value={account.phoneNumber} onChange={handleInputChange} />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Gender:</th>
                                                            <td>
                                                                <select className="form-control" id="gender" name="gender" value={account.gender} onChange={handleInputChange}>
                                                                    <option value="male">Male</option>
                                                                    <option value="female">Female</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </form>

                                    </div>
                                ) : (
                                    <div>
                                        <img src={account.imageUrl} alt="avatar" className="rounded-circle" style={{ width: '30%' }} />

                                        <div >
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
                                    </div>

                                )}
                            </div>
                            <div className="modal-footer">
                                {/* Conditional rendering of buttons based on edit mode */}
                                {editMode ? (
                                    <button type="button" className="btn btn-success" onClick={handleEdit}>Save Changes</button>
                                ) : (
                                    <button type="button" className="btn btn-warning" onClick={toggleEditMode}>Edit</button>
                                )}
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </>
    )
}

export default Header