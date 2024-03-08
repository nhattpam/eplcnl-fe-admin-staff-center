import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import accountService from '../../services/account.service';
import staffService from '../../services/staff.service';
import tutorService from '../../services/tutor.service';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import ReactQuill from 'react-quill';

const EditTutor = () => {

    // Define isAdmin and isStaff outside of the component
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const isStaff = sessionStorage.getItem('isStaff') === 'true';

    const [courseList, setCourseList] = useState([]);


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
        isDelete: "",
        note: ""
    });

    const [tutor, setTutor] = useState({
        staffId: "",
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // State variable for modal visibility
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [coursesPerPage] = useState(2);

    const [staffList, setStaffList] = useState([]);
    useEffect(() => {
        staffService
            .getAllStaff()
            .then((res) => {

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
                    //list course by tutors
                    tutorService
                        .getAllCoursesByTutor(res.data.id)
                        .then((res) => {
                            // Filter the courses where isActive is true
                            console.log(res.data);

                            setCourseList(res.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
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



    const filteredCourses = courseList
        .filter((course) => {
            return (
                course.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    const pageCount = Math.ceil(filteredCourses.length / coursesPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * coursesPerPage;
    const currentCourses = filteredCourses.slice(offset, offset + coursesPerPage);


    //ban account
    const handleNoteChange = (value) => {
        setAccount({ ...account, note: value });
    };


    const handleBanClick = () => {
        setShowModal(true); // Show modal when thumb-down button is clicked
        setAccount({ ...account, isActive: false }); // Set isActive to false
    };

    const handleDeleteClick = () => {
        setShowModal(true); // Show modal when thumb-down button is clicked
        setAccount({ ...account, isActive: false, isDeleted: true }); // Set isActive to false
    };

    const handleActiveClick = () => {
        setAccount({ ...account, isActive: true, isDeleted: false }); // Set isActive to false
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
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div className="table-responsive">
                                                    <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
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
                                                                <td>{account && account.phoneNumber ? account.phoneNumber : 'Unknown Phone Number'}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Date Of Birth:</th>
                                                                <td>{account && account.dateOfBirth ? account.dateOfBirth.substring(0, 10) : 'Unknown DOB'}</td>
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
                                                            <tr>
                                                                <th>Status:</th>
                                                                <td>
                                                                    {account.isActive ? (
                                                                        <span className="badge label-table badge-success">Active</span>
                                                                    ) : (
                                                                        <span className="badge label-table badge-danger">Inactive</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Note:</th>
                                                                <td dangerouslySetInnerHTML={{ __html: account.note }} />
                                                            </tr>
                                                        </tbody>

                                                    </table>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group mb-0">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success " onClick={handleActiveClick}
                                                    >
                                                        <i class="fas fa-thumbs-up"></i>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-warning ml-1" onClick={handleBanClick}
                                                    >
                                                        <i class="fas fa-ban"></i>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-danger ml-1" onClick={handleDeleteClick}
                                                    >
                                                        <i class="fa-solid fa-user-xmark"></i>
                                                    </button>
                                                </div>
                                            </div>


                                        </div>
                                        {showModal && (
                                            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title">Provide Note</h5>
                                                            <button type="button" className="close" onClick={() => setShowModal(false)}>
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <ReactQuill
                                                                value={account.note}
                                                                onChange={handleNoteChange}
                                                                modules={{
                                                                    toolbar: [
                                                                        [{ header: [1, 2, false] }],
                                                                        ['bold', 'italic', 'underline', 'strike'],
                                                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                                                                        [{ 'direction': 'rtl' }],
                                                                        [{ 'align': [] }],
                                                                        ['link', 'image', 'video'],
                                                                        ['code-block'],
                                                                        [{ 'color': [] }, { 'background': [] }],
                                                                        ['clean']
                                                                    ]
                                                                }}
                                                                theme="snow"
                                                            />
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                                            <button type="button" className="btn btn-primary" onClick={(e) => submitAccount(e)}>Submit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {isAdmin && (
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
                                        )}


                                        <div className="form-group">
                                            <label>Created Courses:</label>

                                            <div className="table-responsive">
                                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th data-toggle="true">No.</th>
                                                            <th data-toggle="true">Image</th>
                                                            <th data-toggle="true">Code</th>
                                                            <th data-toggle="true">Name</th>
                                                            <th data-hide="phone">Price</th>
                                                            <th data-hide="phone, tablet">Rating</th>
                                                            <th data-hide="phone, tablet">Tags</th>
                                                            <th data-hide="phone, tablet">Category</th>
                                                            <th data-hide="phone, tablet">Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            currentCourses.length > 0 && (
                                                                currentCourses.map((cus, index) => (

                                                                    <tr>
                                                                        <td>{index + 1}</td>
                                                                        <td>
                                                                            <img src={cus.imageUrl} style={{ height: '70px', width: '100px' }}>

                                                                            </img>
                                                                        </td>
                                                                        <td>{cus.code}</td>
                                                                        <td>{cus.name}</td>
                                                                        <td>{cus.stockPrice}</td>
                                                                        <td>{cus.rating}</td>
                                                                        <td>#{cus.tags}</td>
                                                                        <td>{cus.category.name}</td>
                                                                        <td>
                                                                            {cus.isActive ? (
                                                                                <span className="badge label-table badge-success">Active</span>
                                                                            ) : (
                                                                                <span className="badge label-table badge-danger">Inactive</span>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            <Link to={`/edit-course/${cus.id}`} className='text-secondary'>
                                                                                <i class="fa-regular fa-eye"></i>
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )
                                                        }

                                                    </tbody>

                                                </table>
                                            </div> {/* end .table-responsive*/}
                                        </div>


                                    </form>
                                </div> {/* end card-box*/}
                                {
                                    currentCourses.length === 0 && (
                                        <p>There are no courses.</p>
                                    )
                                }
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

export default EditTutor;
