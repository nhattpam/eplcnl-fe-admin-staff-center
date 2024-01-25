import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();

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
                                <img src={`https://icons8.com/icon/52883/administrator-male`} alt="user-image" className="rounded-circle" />
                                <span className="pro-user-name ml-1">
                                    Geneva <i className="mdi mdi-chevron-down" />
                                </span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
                                {/* item*/}
                                <div className="dropdown-header noti-title">
                                    <h6 className="text-overflow m-0">Welcome !</h6>
                                </div>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
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
                        <li className="dropdown notification-list">
                            <a href="javascript:void(0);" className="nav-link right-bar-toggle waves-effect waves-light">
                                <i className="fe-settings noti-icon" />
                            </a>
                        </li>
                    </ul>
                    {/* LOGO */}
                    <div className="logo-box">
                        <Link to={"/home"} className="logo logo-light text-center">
                            <span style={{ fontFamily: 'Comic Sans MS', fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                                MEOWLISH
                            </span>
                        </Link>
                    </div>

                    <ul className="list-unstyled topnav-menu topnav-menu-left m-0">
                        <li>
                            <button className="button-menu-mobile waves-effect waves-light">
                                <i className="fe-menu" />
                            </button>
                        </li>
                        <li>
                            {/* Mobile menu toggle (Horizontal Layout)*/}
                            <a className="navbar-toggle nav-link" data-toggle="collapse" data-target="#topnav-menu-content">
                                <div className="lines">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </a>
                            {/* End mobile menu toggle*/}
                        </li>
                        <li className="dropdown d-none d-xl-block">
                            <a className="nav-link dropdown-toggle waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                Create New
                                <i className="mdi mdi-chevron-down" />
                            </a>
                            <div className="dropdown-menu">
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item">
                                    <i className="fe-briefcase mr-1" />
                                    <span>New Projects</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item">
                                    <i className="fe-user mr-1" />
                                    <span>Create Users</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item">
                                    <i className="fe-bar-chart-line- mr-1" />
                                    <span>Revenue Report</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item">
                                    <i className="fe-settings mr-1" />
                                    <span>Settings</span>
                                </a>
                                <div className="dropdown-divider" />
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item">
                                    <i className="fe-headphones mr-1" />
                                    <span>Help &amp; Support</span>
                                </a>
                            </div>
                        </li>

                    </ul>
                    <div className="clearfix" />
                </div>
            </div>
            {/* end Topbar */}

        </>
    )
}

export default Header