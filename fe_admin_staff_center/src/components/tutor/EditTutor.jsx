import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { useNavigate, useParams } from 'react-router-dom';
import accountService from '../../services/account.service';
import staffService from '../../services/staff.service';
import tutorService from '../../services/tutor.service';

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

    //get tutor by accountId
    useEffect(() => {
        if (id) {
            accountService
                .getTutorByAccountId(id)
                .then((res) => {
                    setTutor(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTutor({ ...tutor, [name]: value });
    };




    const submitAccount = (e) => {
        e.preventDefault();

        accountService
            .updateAccount(account.id, account)
            .then((res) => {
                if (account.isActive) {
                    // centerService.sendEmail(center.id);
                    //assign staff to tutor
                    tutorService.updateTutor(tutor.id, tutor);
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
                                    <h4 className="header-title">TUTOR INFORMATION</h4>

                                    <form id="demo-form" data-parsley-validate onSubmit={(e) => submitAccount(e)}>
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <th>Tutor Name:</th>
                                                        <td>{account.fullName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Email:</th>
                                                        <td>{account.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Phone Number:</th>
                                                        <td>{account.phoneNumber}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Date Of Birth:</th>
                                                        <td>{account.dateOfBirth}</td>
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
                                                <i class="fa-solid fa-thumbs-up"></i> Approve
                                            </button>
                                        )}
                                        {isAdmin && (

                                            <button
                                                type="submit"
                                                className="btn btn-danger mr-2"
                                                onClick={() => setAccount({ ...account, isActive: false })}
                                            >
                                                <i class="fa-solid fa-thumbs-down"></i> Disapprove
                                            </button>
                                        )}
                                        {isStaff && (

                                            <button
                                                type="submit"
                                                className="btn btn-danger ml-1"
                                            >
                                                <i class="fa-solid fa-user-xmark"></i> Request To Delete
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <button
                                                type="submit"
                                                className="btn btn-danger"
                                            >
                                                <i class="fa-solid fa-user-xmark"></i> Delete
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
