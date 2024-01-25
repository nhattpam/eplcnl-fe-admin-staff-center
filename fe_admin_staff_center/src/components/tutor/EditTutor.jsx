import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { useNavigate, useParams } from 'react-router-dom';
import accountService from '../../services/account.service';

const EditTutor = () => {

    const [account, setAccount] = useState({
      id: "",
      email: "",
      fullName: "",
      phoneNumber:"",
      imageUrl: "",
      dateOfBirth: "",
      gender: "",
      address:"",
      isActive: "",
      createdDate: "",
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();



   


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
                                    <h4 className="header-title">Tutor Information</h4>

                                    <form id="demo-form" data-parsley-validate>
                                        <div className="form-group">
                                            <label htmlFor="fullname">Tutor Name * :</label>
                                            <input type="text" className="form-control" name="fullname" id="fullname" value={account.fullName} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email * :</label>
                                            <input type="email" id="email" className="form-control" name="email" data-parsley-trigger="change" value={account.email} readOnly />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="description">Phone Number * :</label>
                                            <input type="text" id="description" className="form-control" name="description" data-parsley-trigger="change" value={account.description} readOnly />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="description">DOB * :</label>
                                            <input type="text" id="description" className="form-control" name="description" data-parsley-trigger="change" value={account.description} readOnly />
                                        </div>

                                        <div className="form-group mb-0">
                                            <button
                                                type="submit"
                                                className="btn btn-danger"
                                            >
                                                <i className="bi bi-x-lg"></i> Request to delete
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
                        width: 85%;
                        text-align: left;
                    }
                `}
            </style>
        </>
    )
}

export default EditTutor;
