import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <>
            {/* ========== Left Sidebar Start ========== */}
            <div className="left-side-menu">
                <div className="h-100" data-simplebar>
                    {/* User box */}
                    <div className="user-box text-center">
                        <img src="../assets/images/users/user-1.jpg" alt="user-img" title="Mat Helme" className="rounded-circle avatar-md" />
                        <div className="dropdown">
                            <a href="javascript: void(0);" className="text-dark dropdown-toggle h5 mt-2 mb-1 d-block" data-toggle="dropdown">Geneva Kennedy</a>
                            <div className="dropdown-menu user-pro-dropdown">
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-user mr-1" />
                                    <span>My Account</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-settings mr-1" />
                                    <span>Settings</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-lock mr-1" />
                                    <span>Lock Screen</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
                                    <i className="fe-log-out mr-1" />
                                    <span>Logout</span>
                                </a>
                            </div>
                        </div>
                        <p className="text-muted">Admin Head</p>
                    </div>
                    {/*- Sidemenu */}
                    <div id="sidebar-menu">
                        <ul id="side-menu">
                            <li className="menu-title">Navigation</li>
                            <li>
                                <Link to={"/home"} data-toggle="collapse">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-airplay"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path><polygon points="12 15 17 21 7 21 12 15"></polygon></svg>
                                    <span> Dashboards </span>
                                </Link>

                            </li>
                            <li className="menu-title mt-2">Manages</li>
                            <li>
                                <Link to={"/list-center"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-activity"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                    <span> Center </span>
                                </Link>
                            </li>

                            <li>
                                <a href="#sidebarEcommerce" data-toggle="collapse">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    <span> Account </span>
                                    <span className="menu-arrow" />
                                </a>
                                <div className="collapse" id="sidebarEcommerce">
                                    <ul className="nav-second-level">
                                        <li>
                                            <Link to={"/list-staff"}>Staff</Link>
                                        </li>
                                        <li>
                                            <Link to={"/list-tutor"}>Tutor</Link>
                                        </li>
                                        <li>
                                            <Link to={"/list-learner"}>Learner</Link>
                                        </li>

                                    </ul>
                                </div>
                            </li>


                        </ul>
                    </div>
                    {/* End Sidebar */}
                    <div className="clearfix" />
                </div>
                {/* Sidebar -left */}
            </div>
            {/* Left Sidebar End */}
            <style>
                {`
                    .left-side-menu {
                        flex: 1;
                        width: 100%;
                        text-align: left;
                    }
                `}
            </style>
        </>
    )
}

export default Sidebar