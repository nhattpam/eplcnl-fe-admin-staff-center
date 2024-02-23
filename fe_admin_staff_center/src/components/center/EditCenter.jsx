import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import centerService from '../../services/center.service';
import { Link, useNavigate, useParams } from 'react-router-dom';
import staffService from '../../services/staff.service';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';

const EditCenter = () => {

    // Define isAdmin and isStaff outside of the component
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const isStaff = sessionStorage.getItem('isStaff') === 'true';

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

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [tutorsPerPage] = useState(2);

    //list staff
    const [staffList, setStaffList] = useState([]);
    const [tutorList, setTutorList] = useState([]);



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
        centerService
            .getAllTutorsByCenter(id)
            .then((res) => {
                console.log(res.data);
                setTutorList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const filteredTutors = tutorList
        .filter((tutor) => {
            return (
                tutor.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    const pageCount = Math.ceil(filteredTutors.length / tutorsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * tutorsPerPage;
    const currentTutors = filteredTutors.slice(offset, offset + tutorsPerPage);


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
                    if (center.isActive) {
                        centerService.sendEmail(center.id);
                    }
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
                                    <h4 className="header-title">CENTER INFORMATION</h4>

                                    <div className="alert alert-warning d-none fade show">
                                        <h4 className="mt-0 text-warning">Oh snap!</h4>
                                        <p className="mb-0">This form seems to be invalid :(</p>
                                    </div>
                                    <div className="alert alert-info d-none fade show">
                                        <h4 className="mt-0 text-info">Yay!</h4>
                                        <p className="mb-0">Everything seems to be ok :)</p>
                                    </div>
                                    <form id="demo-form" data-parsley-validate onSubmit={(e) => submitCenter(e)}>
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div className="table-responsive">
                                                    <table className="table table-bordered">
                                                        <tbody>
                                                            <tr>
                                                                <th>Center Name:</th>
                                                                <td>{center.name}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Email:</th>
                                                                <td>{center.email}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Description:</th>
                                                                <td>{center.description}</td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                {isAdmin && (
                                                    <div className="form-group mb-0">
                                                        {/* Approve Button */}
                                                        <button
                                                            type="submit"
                                                            className="btn btn-success mr-2"
                                                            onClick={() => setCenter({ ...center, isActive: true })}
                                                        >
                                                            <i class="fa-solid fa-thumbs-up"></i>
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-danger mr-2"
                                                            onClick={() => setCenter({ ...center, isActive: false })}
                                                        >
                                                            <i class="fa-solid fa-thumbs-down"></i>
                                                        </button>

                                                        {/* <button
                                                            type="submit"
                                                            className="btn btn-danger"
                                                        >
                                                            <i class="fas fa-user-slash"></i>                                                        </button> */}

                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {isAdmin && (

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
                                        )}

                                        <div className="form-group">
                                            <label>Tutors:</label>

                                            <div className="table-responsive text-center">
                                                <table id="demo-foo-filtering" className="table table-bordered toggle-circle mb-0" data-page-size={7}>
                                                    <thead>
                                                        <tr>
                                                            <th data-toggle="true">No.</th>
                                                            <th data-toggle="true">Image</th>
                                                            <th data-toggle="true">Full Name</th>
                                                            <th data-toggle="true">Phone</th>
                                                            <th data-hide="phone">Gender</th>
                                                            <th data-hide="phone, tablet">DOB</th>
                                                            <th data-hide="phone, tablet">Status</th>
                                                            <th>Action</th>
                                                            <th>Courses</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentTutors.map((tutor, index) => (
                                                            <tr key={tutor.id}>
                                                                <td>{index+1}</td>
                                                                <td>
                                                                    <img src={tutor.account.imageUrl} style={{ height: '70px', width: '50px' }}>

                                                                    </img>
                                                                </td>
                                                                <td>{tutor.account && tutor.account.fullName ? tutor.account.fullName : 'Unknown Name'}</td>
                                                                <td>{tutor.account && tutor.account.phoneNumber ? tutor.account.phoneNumber : 'Unknown Phone Number'}</td>
                                                                <td>{tutor.account && tutor.account.gender !== undefined ? (tutor.account.gender ? 'Male' : 'Female') : 'Unknown Gender'}</td>                                                            <td>{tutor.account && tutor.account.dateOfBirth ? tutor.account.dateOfBirth : 'Unknown DOB'}</td>
                                                                <td>
                                                                    {tutor.account.isActive ? (
                                                                        <span className="badge label-table badge-success">Active</span>
                                                                    ) : (
                                                                        <span className="badge label-table badge-danger">Inactive</span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <Link to={`/edit-tutor/${tutor.account.id}`} className='text-secondary'>
                                                                        <i className="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td>
                                                                <td>
                                                                    <Link to={`/list-course-by-tutor/${tutor.id}`} className='text-dark'>
                                                                        <i class="ti-more-alt"></i>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>





                                    </form>
                                </div> {/* end card-box*/}
                            </div> {/* end col*/}
                        </div>
                        {/* end row*/}
                        {/* Pagination */}
                        <div className='container-fluid'>
                            {/* Pagination */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <ReactPaginate
                                    previousLabel={
                                        <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                            <AiFillCaretLeft />
                                        </IconContext.Provider>
                                    }
                                    nextLabel={
                                        <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                            <AiFillCaretRight />
                                        </IconContext.Provider>
                                    } breakLabel={'...'}
                                    breakClassName={'page-item'}
                                    breakLinkClassName={'page-link'}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageClick}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                    previousClassName={'page-item'}
                                    nextClassName={'page-item'}
                                    pageClassName={'page-item'}
                                    previousLinkClassName={'page-link'}
                                    nextLinkClassName={'page-link'}
                                    pageLinkClassName={'page-link'}
                                />
                            </div>

                        </div>

                    </div> {/* container */}
                </div>
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

                    .page-item.active .page-link{
                        background-color: #20c997;
                        border-color: #20c997;
                    }
                `}
            </style>
        </>
    )
}

export default EditCenter;