import React, { useState } from 'react'
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import accountService from '../../services/account.service'
import tutorService from '../../services/tutor.service'

const CreateTutor = () => {

    const centerId = localStorage.getItem('centerId');
    const navigate = useNavigate();



    const [account, setAccount] = useState({
        fullName: "",
        email: "",
        password: "",
        isActive: true,
        roleId: '1dc7ed61-a13d-4cfc-9e3e-2159f61bad3b', //role cua tutor
        gender: null
    });


    const [tutor, setTutor] = useState({
        accountId: "",
        isFreelancer: false,
        centerId: centerId,
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState("");


    const handleChange = (e) => {
        const value = e.target.value;
        setAccount({ ...account, [e.target.name]: value });
    }

    const handleDropdownChange = (e) => {
        const value = e.target.value;
        if (value === "Male") {
            setAccount({ ...account, gender: true });
        }
        if (value === "Female") {
            setAccount({ ...account, gender: false });
        }
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (account.fullName.trim() === '') {
            errors.fullName = 'Full Name is required';
            isValid = false;
        }

        if (account.password.trim() === '') {
            errors.password = 'Password is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };


    const submitAccount = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                // Save account
                console.log(JSON.stringify(account))
                const accountResponse = await accountService.saveAccount(account);
                console.log(accountResponse.data);

                // Update tutor with accountId and save tutor
                const updatedTutor = { ...tutor, accountId: accountResponse.data.id };
                setTutor(updatedTutor);

                console.log(updatedTutor)

                const tutorResponse = await tutorService.saveTutor(updatedTutor);
                console.log(tutorResponse.data);

                setMsg('Account and Tutor Added Successfully');

                navigate(`/list-tutor/${centerId}`);

            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                <div className="content-page">
                    {/* Start Content*/}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card-box">
                                    <h4 className="header-title">Create new tutor</h4>
                                    <form id="demo-form" data-parsley-validate onSubmit={(e) => submitAccount(e)}>
                                        <div className="form-group">
                                            <label htmlFor="fullName">Full Name * :</label>
                                            <input type="text" className="form-control" name="fullName" id="fullName" required value={account.fullName} onChange={(e) => handleChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email * :</label>
                                            <input type="email" id="email" className="form-control" name="email" data-parsley-trigger="change" required value={account.email} onChange={(e) => handleChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password * :</label>
                                            <input type="password" className="form-control" name="password" id="password" required value={account.password} onChange={(e) => handleChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Gender *:</label>
                                            <select
                                                id="gender"
                                                name="gender"
                                                className="form-control"
                                                value={account.gender === null ? '' : account.gender ? 'Male' : 'Female'}
                                                onChange={(e) => handleDropdownChange(e)}
                                                required
                                            >
                                                <option value="" disabled>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>


                                        </div>

                                        <div className="form-group mb-0">
                                            {/* Approve Button */}
                                            <button type="submit" className="btn btn-success mr-2">
                                                <i className="bi bi-check-lg"></i> Create
                                            </button>

                                        </div>
                                    </form>
                                </div> {/* end card-box*/}
                            </div> {/* end col*/}
                        </div>
                        {/* end row*/}

                    </div> {/* container */}
                </div>
                <Footer />
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
                    width: 100%;
                    text-align: left;
                }
            `}
            </style>
        </>
    )
}

export default CreateTutor