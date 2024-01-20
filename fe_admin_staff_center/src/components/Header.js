import React from 'react'

const Header = () => {
    return (
        <>
            {/* Topbar Start */}
            <div className="navbar-custom">
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
                                    <div className="dropdown-menu dropdown-lg" id="search-dropdown">
                                        {/* item*/}
                                        <div className="dropdown-header noti-title">
                                            <h5 className="text-overflow mb-2">Found 22 results</h5>
                                        </div>
                                        {/* item*/}
                                        <a href="javascript:void(0);" className="dropdown-item notify-item">
                                            <i className="fe-home mr-1" />
                                            <span>Analytics Report</span>
                                        </a>
                                        {/* item*/}
                                        <a href="javascript:void(0);" className="dropdown-item notify-item">
                                            <i className="fe-aperture mr-1" />
                                            <span>How can I help you?</span>
                                        </a>
                                        {/* item*/}
                                        <a href="javascript:void(0);" className="dropdown-item notify-item">
                                            <i className="fe-settings mr-1" />
                                            <span>User profile settings</span>
                                        </a>
                                        {/* item*/}
                                        <div className="dropdown-header noti-title">
                                            <h6 className="text-overflow mb-2 text-uppercase">Users</h6>
                                        </div>
                                        <div className="notification-list">
                                            {/* item*/}
                                            <a href="javascript:void(0);" className="dropdown-item notify-item">
                                                <div className="media">
                                                    <img className="d-flex mr-2 rounded-circle" src="../assets/images/users/user-2.jpg" alt="Generic placeholder image" height={32} />
                                                    <div className="media-body">
                                                        <h5 className="m-0 font-14">Erwin E. Brown</h5>
                                                        <span className="font-12 mb-0">UI Designer</span>
                                                    </div>
                                                </div>
                                            </a>
                                            {/* item*/}
                                            <a href="javascript:void(0);" className="dropdown-item notify-item">
                                                <div className="media">
                                                    <img className="d-flex mr-2 rounded-circle" src="../assets/images/users/user-5.jpg" alt="Generic placeholder image" height={32} />
                                                    <div className="media-body">
                                                        <h5 className="m-0 font-14">Jacob Deo</h5>
                                                        <span className="font-12 mb-0">Developer</span>
                                                    </div>
                                                </div>
                                            </a>
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
                        <li className="dropdown d-none d-lg-inline-block">
                            <a className="nav-link dropdown-toggle arrow-none waves-effect waves-light" data-toggle="fullscreen" href="#">
                                <i className="fe-maximize noti-icon" />
                            </a>
                        </li>
                        <li className="dropdown d-none d-lg-inline-block topbar-dropdown">
                            <a className="nav-link dropdown-toggle arrow-none waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                <i className="fe-grid noti-icon" />
                            </a>
                            <div className="dropdown-menu dropdown-lg dropdown-menu-right">
                                <div className="p-lg-1">
                                    <div className="row no-gutters">
                                        <div className="col">
                                            <a className="dropdown-icon-item" href="#">
                                                <img src="../assets/images/brands/slack.png" alt="slack" />
                                                <span>Slack</span>
                                            </a>
                                        </div>
                                        <div className="col">
                                            <a className="dropdown-icon-item" href="#">
                                                <img src="../assets/images/brands/github.png" alt="Github" />
                                                <span>GitHub</span>
                                            </a>
                                        </div>
                                        <div className="col">
                                            <a className="dropdown-icon-item" href="#">
                                                <img src="../assets/images/brands/dribbble.png" alt="dribbble" />
                                                <span>Dribbble</span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="row no-gutters">
                                        <div className="col">
                                            <a className="dropdown-icon-item" href="#">
                                                <img src="../assets/images/brands/bitbucket.png" alt="bitbucket" />
                                                <span>Bitbucket</span>
                                            </a>
                                        </div>
                                        <div className="col">
                                            <a className="dropdown-icon-item" href="#">
                                                <img src="../assets/images/brands/dropbox.png" alt="dropbox" />
                                                <span>Dropbox</span>
                                            </a>
                                        </div>
                                        <div className="col">
                                            <a className="dropdown-icon-item" href="#">
                                                <img src="../assets/images/brands/g-suite.png" alt="G Suite" />
                                                <span>G Suite</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="dropdown d-none d-lg-inline-block topbar-dropdown">
                            <a className="nav-link dropdown-toggle arrow-none waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                <img src="../assets/images/flags/us.jpg" alt="user-image" height={16} />
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item">
                                    <img src="../assets/images/flags/germany.jpg" alt="user-image" className="mr-1" height={12} /> <span className="align-middle">German</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item">
                                    <img src="../assets/images/flags/italy.jpg" alt="user-image" className="mr-1" height={12} /> <span className="align-middle">Italian</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item">
                                    <img src="../assets/images/flags/spain.jpg" alt="user-image" className="mr-1" height={12} /> <span className="align-middle">Spanish</span>
                                </a>
                                {/* item*/}
                                <a href="javascript:void(0);" className="dropdown-item">
                                    <img src="../assets/images/flags/russia.jpg" alt="user-image" className="mr-1" height={12} /> <span className="align-middle">Russian</span>
                                </a>
                            </div>
                        </li>
                        <li className="dropdown notification-list topbar-dropdown">
                            <a className="nav-link dropdown-toggle waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                <i className="fe-bell noti-icon" />
                                <span className="badge badge-danger rounded-circle noti-icon-badge">9</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right dropdown-lg">
                                {/* item*/}
                                <div className="dropdown-item noti-title">
                                    <h5 className="m-0">
                                        <span className="float-right">
                                            <a href="#" className="text-dark">
                                                <small>Clear All</small>
                                            </a>
                                        </span>Notification
                                    </h5>
                                </div>
                                <div className="noti-scroll" data-simplebar>
                                    {/* item*/}
                                    <a href="javascript:void(0);" className="dropdown-item notify-item active">
                                        <div className="notify-icon">
                                            <img src="../assets/images/users/user-1.jpg" className="img-fluid rounded-circle" alt /> </div>
                                        <p className="notify-details">Cristina Pride</p>
                                        <p className="text-muted mb-0 user-msg">
                                            <small>Hi, How are you? What about our next meeting</small>
                                        </p>
                                    </a>
                                    {/* item*/}
                                    <a href="javascript:void(0);" className="dropdown-item notify-item">
                                        <div className="notify-icon bg-primary">
                                            <i className="mdi mdi-comment-account-outline" />
                                        </div>
                                        <p className="notify-details">Caleb Flakelar commented on Admin
                                            <small className="text-muted">1 min ago</small>
                                        </p>
                                    </a>
                                    {/* item*/}
                                    <a href="javascript:void(0);" className="dropdown-item notify-item">
                                        <div className="notify-icon">
                                            <img src="../assets/images/users/user-4.jpg" className="img-fluid rounded-circle" alt /> </div>
                                        <p className="notify-details">Karen Robinson</p>
                                        <p className="text-muted mb-0 user-msg">
                                            <small>Wow ! this admin looks good and awesome design</small>
                                        </p>
                                    </a>
                                    {/* item*/}
                                    <a href="javascript:void(0);" className="dropdown-item notify-item">
                                        <div className="notify-icon bg-warning">
                                            <i className="mdi mdi-account-plus" />
                                        </div>
                                        <p className="notify-details">New user registered.
                                            <small className="text-muted">5 hours ago</small>
                                        </p>
                                    </a>
                                    {/* item*/}
                                    <a href="javascript:void(0);" className="dropdown-item notify-item">
                                        <div className="notify-icon bg-info">
                                            <i className="mdi mdi-comment-account-outline" />
                                        </div>
                                        <p className="notify-details">Caleb Flakelar commented on Admin
                                            <small className="text-muted">4 days ago</small>
                                        </p>
                                    </a>
                                    {/* item*/}
                                    <a href="javascript:void(0);" className="dropdown-item notify-item">
                                        <div className="notify-icon bg-secondary">
                                            <i className="mdi mdi-heart" />
                                        </div>
                                        <p className="notify-details">Carlos Crouch liked
                                            <b>Admin</b>
                                            <small className="text-muted">13 days ago</small>
                                        </p>
                                    </a>
                                </div>
                                {/* All*/}
                                <a href="javascript:void(0);" className="dropdown-item text-center text-primary notify-item notify-all">
                                    View all
                                    <i className="fe-arrow-right" />
                                </a>
                            </div>
                        </li>
                        <li className="dropdown notification-list topbar-dropdown">
                            <a className="nav-link dropdown-toggle nav-user mr-0 waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                <img src="../assets/images/users/user-1.jpg" alt="user-image" className="rounded-circle" />
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
                                <a href="javascript:void(0);" className="dropdown-item notify-item">
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
                        <a href="index.html" className="logo logo-dark text-center">
                            <span className="logo-sm">
                                <img src="../assets/images/logo-sm.png" alt height={22} />
                                {/* <span class="logo-lg-text-light">UBold</span> */}
                            </span>
                            <span className="logo-lg">
                                <img src="../assets/images/logo-dark.png" alt height={20} />
                                {/* <span class="logo-lg-text-light">U</span> */}
                            </span>
                        </a>
                        <a href="index.html" className="logo logo-light text-center">
                            <span className="logo-sm">
                                <img src="../assets/images/logo-sm.png" alt height={22} />
                            </span>
                            <span className="logo-lg">
                                <img src="../assets/images/logo-light.png" alt height={20} />
                            </span>
                        </a>
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
                        <li className="dropdown dropdown-mega d-none d-xl-block">
                            <a className="nav-link dropdown-toggle waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                Mega Menu
                                <i className="mdi mdi-chevron-down" />
                            </a>
                            <div className="dropdown-menu dropdown-megamenu">
                                <div className="row">
                                    <div className="col-sm-8">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <h5 className="text-dark mt-0">UI Components</h5>
                                                <ul className="list-unstyled megamenu-list">
                                                    <li>
                                                        <a href="javascript:void(0);">Widgets</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Nestable List</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Range Sliders</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Masonry Items</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Sweet Alerts</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Treeview Page</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Tour Page</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-md-4">
                                                <h5 className="text-dark mt-0">Applications</h5>
                                                <ul className="list-unstyled megamenu-list">
                                                    <li>
                                                        <a href="javascript:void(0);">eCommerce Pages</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">CRM Pages</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Email</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Calendar</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Team Contacts</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Task Board</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Email Templates</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-md-4">
                                                <h5 className="text-dark mt-0">Extra Pages</h5>
                                                <ul className="list-unstyled megamenu-list">
                                                    <li>
                                                        <a href="javascript:void(0);">Left Sidebar with User</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Menu Collapsed</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Small Left Sidebar</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">New Header Style</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Search Result</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Gallery Pages</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);">Maintenance &amp; Coming Soon</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="text-center mt-3">
                                            <h3 className="text-dark">Special Discount Sale!</h3>
                                            <h4>Save up to 70% off.</h4>
                                            <button className="btn btn-primary btn-rounded mt-3">Download Now</button>
                                        </div>
                                    </div>
                                </div>
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