import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authenticationService from '../services/authentication.service';
import centerService from '../services/center.service';
import accountService from '../services/account.service';
import courseService from '../services/course.service';
import learnerService from '../services/learner.service';
import staffService from '../services/staff.service';
import tutorService from '../services/tutor.service';


const SignIn = ({ setIsLoggedIn, setRole }) => {

    //login and set jwt token
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setBearerToken] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //get centerId by accountId
    const centersResponse = centerService.getAllCenter();

    //get staffId by accountId
    const staffsResponse = staffService.getAllStaff();

    //get adminId by accountId
    const accountsResponse = accountService.getAllAccount();


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await authenticationService.loginUser(email, password);
            if (response.data.success) {
                const decodedToken = JSON.parse(atob(response.data.data.split('.')[1])); // Decoding the JWT token

                console.log('this is role: ' + decodedToken.role);
                localStorage.setItem('accountId', decodedToken.Id);

                if (decodedToken.role.toString() === "5f9a0e31-e7b2-417b-917d-111468a18a53"
                    || decodedToken.role.toString() === "887428d0-9ded-449c-94ee-7c8a489ab763"
                    || decodedToken.role.toString() === "14191b0a-2ec2-48e3-9ede-c34d5de0ba32") {
                    setIsLoggedIn(true);

                    // Store the JWT token in localStorage
                    localStorage.setItem('token', response.data.data);
                    // Pass the token to the module
                    console.log('this is token: ' + response.data.data);
                    centerService.setToken(response.data.data);
                    accountService.setToken(response.data.data);
                    courseService.setToken(response.data.data);
                    learnerService.setToken(response.data.data);
                    centerService.setToken(response.data.data);
                    staffService.setToken(response.data.data);
                    tutorService.setToken(response.data.data);

                    // Store other necessary information
                    if (decodedToken.role === "5f9a0e31-e7b2-417b-917d-111468a18a53") {
                        console.log("admin")
                        sessionStorage.setItem('isAdmin', true);
                        sessionStorage.setItem('isStaff', false);
                        sessionStorage.setItem('isCenter', false);

                        // Access adminId from localStorage
                        localStorage.setItem('adminId', decodedToken.Id);
                        const storedAdminId = localStorage.getItem('centerId');
                        console.log("This is adminId from localStorage:", storedAdminId);


                    }
                    // Navigate to the home page
                    navigate('/admin-home');
                    if (decodedToken.role === "887428d0-9ded-449c-94ee-7c8a489ab763") {
                        console.log("staff")
                        sessionStorage.setItem('isAdmin', false);
                        sessionStorage.setItem('isStaff', true);
                        sessionStorage.setItem('isCenter', false);


                        console.log("This is accountId: " + decodedToken.Id.toString())

                        console.log((await staffsResponse).data)

                        // Find the staff with matching accountId
                        const matchedStaff = (await staffsResponse).data.find(staff => staff.account.id === decodedToken.Id);

                        if (matchedStaff) {
                            console.log("This is staffId:", matchedStaff.id);

                            // Access centerId from localStorage
                            localStorage.setItem('staffId', matchedStaff.id);
                            const storedStaffId = localStorage.getItem('staffId');
                            console.log("This is staffId from localStorage:", storedStaffId);
                        } else {
                            console.log("No matching center found for the given accountId");
                        }
                        // Navigate to the home page
                        navigate('/staff-home');
                    }
                    if (decodedToken.role === "14191b0a-2ec2-48e3-9ede-c34d5de0ba32") {
                        console.log("center")
                        sessionStorage.setItem('isAdmin', false);
                        sessionStorage.setItem('isStaff', false);
                        sessionStorage.setItem('isCenter', true);


                        console.log("This is accountId: " + decodedToken.Id.toString())

                        console.log((await centersResponse).data)

                        // Find the center with matching accountId
                        const matchedCenter = (await centersResponse).data.find(center => center.account.id === decodedToken.Id);

                        if (matchedCenter) {
                            console.log("This is centerId:", matchedCenter.id);

                            // Access centerId from localStorage
                            localStorage.setItem('centerId', matchedCenter.id);
                            const storedCenterId = localStorage.getItem('centerId');
                            console.log("This is centerId from localStorage:", storedCenterId);
                        } else {
                            console.log("No matching center found for the given accountId");
                        }
                        // Navigate to the home page
                        navigate('/center-home');
                    }


                } else {
                    setIsLoggedIn(false);
                    setError('You are not authorized to access this page.');
                }
            } else {
                setIsLoggedIn(false);
                setError('Login failed. Please try again.');
            }
        } catch (error) {
            console.log('Login failed:', error);
            setIsLoggedIn(false);
            setError('Login failed. Please try again.');
        }
    };



    return (
        <>
            <div className="auth-fluid">
                {/*Auth fluid left content */}
                <div className="auth-fluid-form-box">
                    <div className="align-items-center d-flex h-100">
                        <div className="card-body">
                            {/* Logo */}
                            <div className="auth-brand text-center text-lg-left">
                                <div className="auth-logo">
                                    <a className="logo logo-dark text-center">
                                        <span style={{ fontFamily: 'Comic Sans MS', fontSize: '24px', fontWeight: 'bold', color: '#000037' }}>
                                            MEOWLISH
                                        </span>
                                    </a>
                                    <a className="logo logo-light text-center">
                                        <span style={{ fontFamily: 'Comic Sans MS', fontSize: '24px', fontWeight: 'bold', color: '#000037' }}>
                                            MEOWLISH
                                        </span>
                                    </a>
                                </div>
                            </div>
                            {/* title*/}
                            <h4 className="mt-0">Sign In</h4>
                            {/* form */}
                            {error && <p className="text-danger">{error}</p>} {/* Display error message */}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="emailaddress">Email address</label>
                                    <input className="form-control" value={email}
                                        onChange={handleEmailChange}
                                        type="email" id="emailaddress" required placeholder="Enter your email" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <div className="input-group input-group-merge">
                                        <input type="password" id="password" value={password}
                                            onChange={handlePasswordChange}
                                            className="form-control" placeholder="Enter your password" />
                                        <div className="input-group-append" data-password="false">
                                            <div className="input-group-text">
                                                <span className="password-eye" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mb-0 text-center">
                                    <button className="btn btn-dark btn-block" type="submit">Log In </button>
                                </div>
                            </form>
                            {/* Footer*/}
                        </div> {/* end .card-body */}
                    </div> {/* end .align-items-center.d-flex.h-100*/}
                </div>
                {/* end auth-fluid-form-box*/}
                {/* Auth fluid right content */}
                <div className="auth-fluid-right text-center" style={{ backgroundImage: `url(/admin_login.jpg)`, backgroundSize: 'cover', height: '100vh' }}>
                    <div className="auth-user-testimonial">

                        {/* <h2 className="mb-3 text-white">I love the color!</h2>
                        <p className="lead"><i className="mdi mdi-format-quote-open" /> I've been using your theme from the previous developer for our web app, once I knew new version is out, I immediately bought with no hesitation. Great themes, good documentation with lots of customization available and sample app that really fit our need. <i className="mdi mdi-format-quote-close" />
                        </p>
                        <h5 className="text-white">
                            - MeowLish developer
                        </h5> */}
                    </div> {/* end auth-user-testimonial*/}
                </div>
                {/* end Auth fluid right content */}
            </div>
            {/* end auth-fluid*/}
            <style>
                {`
                auth-fluid, #wrapper {
                    height: 100%;
                    margin: 0;
                }

                #wrapper {
                    display: flex;
                    flex-direction: column;
                }

                .auth-fluid {
                    flex: 1;
                    width: 100%;
                    text-align: left;
                }
            `}
            </style>
        </>
    )
}

export default SignIn