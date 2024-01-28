import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import centerService from '../../services/center.service';
import { useNavigate, useParams } from 'react-router-dom';
import staffService from '../../services/staff.service';

const EditCenter = () => {

    const [center, setCenter] = useState({
        id: '',
        name: "",
        address: "",
        description: "",
        isActive: true,
        staffId: "",
        accountId: ""
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    //list staff
    const [staffList, setStaffList] = useState([]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name === 'isActive') {
            // For checkboxes (isActive), use the checked value
            setCenter({ ...center, [name]: checked });
        } else {
            // For other fields, use the regular value
            setCenter({ ...center, [name]: value });
        }
    };


    const { id } = useParams();

    useEffect(() => {
        if (id) {
            centerService
                .getCenterById(id)
                .then((res) => {
                    setCenter(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);

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

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (center.name.trim() === '') {
            errors.name = 'Center Name is required';
            isValid = false;
        }

        if (center.description.trim() === '') {
            errors.description = 'Description is required';
            isValid = false;
        }

        if (center.address.trim() === '') {
            errors.address = 'Address is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };




    const submitCenter = (e) => {
        e.preventDefault();

        if (validateForm()) {
            centerService
                .updateCenter(center.id, center)
                .then((res) => {
                    navigate("/list-center/");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
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
                                    <h4 className="header-title">Center Information</h4>

                                    <div className="alert alert-warning d-none fade show">
                                        <h4 className="mt-0 text-warning">Oh snap!</h4>
                                        <p className="mb-0">This form seems to be invalid :(</p>
                                    </div>
                                    <div className="alert alert-info d-none fade show">
                                        <h4 className="mt-0 text-info">Yay!</h4>
                                        <p className="mb-0">Everything seems to be ok :)</p>
                                    </div>
                                    <form id="demo-form" data-parsley-validate onSubmit={(e) => submitCenter(e)}>
                                        <div className="form-group">
                                            <label htmlFor="fullname">Center Name * :</label>
                                            <input type="text" className="form-control" name="fullname" id="fullname" value={center.name} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email * :</label>
                                            <input type="email" id="email" className="form-control" name="email" data-parsley-trigger="change" value={center.email} readOnly />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="description">Description * :</label>
                                            <textarea type="text" id="description" className="form-control" name="description" data-parsley-trigger="change" value={center.description} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="staffId">Is Managed By *:</label>
                                            <select
                                                className="form-control"
                                                id="staffId"
                                                name="staffId"
                                                value={center.staffId}
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


                                        <div className="form-group mb-0">
                                            {/* Approve Button */}
                                            <button
                                                type="submit"
                                                className="btn btn-success mr-2"
                                                onClick={() => setCenter({ ...center, isActive: true })}
                                            >
                                                <i className="bi bi-check-lg"></i> Approve
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-danger"
                                                onClick={() => setCenter({ ...center, isActive: false })}
                                            >
                                                <i className="bi bi-x-lg"></i> Disapprove
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

export default EditCenter;