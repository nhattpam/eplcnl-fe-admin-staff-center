import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { useNavigate, useParams } from 'react-router-dom';
import accountService from '../../services/account.service';
import staffService from '../../services/staff.service';

const EditTutor = () => {

    // Define isAdmin and isStaff outside of the component
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const isStaff = sessionStorage.getItem('isStaff') === 'true';

    const [account, setAccount] = useState({
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
    });

    const [tutor, setTutor] = useState({
        staffId: "",
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const [staffList, setStaffList] = useState([]);
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


    const { id } = useParams();

    useEffect(() => {
        if (id) {
            accountService
                .getAccountById(id)
                .then((res) => {
                    setAccount(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name === 'isActive') {
            // For checkboxes (isActive), use the checked value
            setAccount({ ...account, [name]: checked });
        } else {
            // For other fields, use the regular value
            setAccount({ ...account, [name]: value });
        }
    };



    const submitAccount = (e) => {
        e.preventDefault();

        accountService
            .updateAccount(account.id, account)
            .then((res) => {
                if (account.isActive) {
                    // centerService.sendEmail(center.id);
                }
                navigate("/list-tutor/");
            })
            .catch((error) => {
                console.log(error);
            });
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
                                    <h4 className="header-title">Tutor Information</h4>

                                    <form id="demo-form" data-parsley-validate onSubmit={(e) => submitAccount(e)}> 
                                        <div className="form-group">
                                            <label htmlFor="fullname">Tutor Name * :</label>
                                            <input type="text" className="form-control" name="fullname" id="fullname" value={account.fullName} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email * :</label>
                                            <input type="email" id="email" className="form-control" name="email" data-parsley-trigger="change" value={account.email} readOnly />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="phoneNumber">Phone Number * :</label>
                                            <input type="text" id="phoneNumber" className="form-control" name="phoneNumber" data-parsley-trigger="change" value={account.phoneNumber} readOnly />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="dateOfBirth">DOB * :</label>
                                            <input type="text" id="dateOfBirth" className="form-control" name="dateOfBirth" data-parsley-trigger="change" value={account.dateOfBirth} readOnly />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="dateOfBirth">Gender * :</label>

                                            {account.gender ? (
                                                <input type="text" id="dateOfBirth" className="form-control" name="dateOfBirth" data-parsley-trigger="change" value={"Male"} readOnly />
                                            ) : (
                                                <input type="text" id="dateOfBirth" className="form-control" name="dateOfBirth" data-parsley-trigger="change" value={"Female"} readOnly />
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="staffId">Is Managed By *:</label>
                                            <select
                                                className="form-control"
                                                id="staffId"
                                                name="staffId"
                                                value={tutor.staffId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Staff</option>
                                                {staffList.map((staff) => (
                                                    <option key={staff.id} value={staff.id}>
                                                        {staff.account ? staff.account.fullName : 'Unknown Name'}
                                                    </option>
                                                ))}

                                            </select>
                                        </div>

                                        {isAdmin && (

                                            <button
                                                type="submit"
                                                className="btn btn-success mr-2"
                                                onClick={() => setAccount({ ...account, isActive: true })}
                                            >
                                                <i className="bi bi-x-lg"></i> Approve
                                            </button>
                                        )}
                                        {isAdmin && (

                                            <button
                                                type="submit"
                                                className="btn btn-danger mr-2"
                                                onClick={() => setAccount({ ...account, isActive: false })}
                                            >
                                                <i className="bi bi-x-lg"></i> Disapprove
                                            </button>
                                        )}
                                        {isStaff && (

                                            <button
                                                type="submit"
                                                className="btn btn-danger ml-1"
                                            >
                                                <i className="bi bi-x-lg"></i> Request to delete
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <button
                                                type="submit"
                                                className="btn btn-danger"
                                            >
                                                <i className="bi bi-x-lg"></i> Delete
                                            </button>
                                        )}
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
                        width: 85%;
                        text-align: left;
                    }
                `}
            </style>
        </>
    )
}

export default EditTutor;
