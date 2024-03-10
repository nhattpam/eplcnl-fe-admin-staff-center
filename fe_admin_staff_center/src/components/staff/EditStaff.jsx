import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import accountService from '../../services/account.service';
import staffService from '../../services/staff.service';
import { IconContext } from 'react-icons';
import ReactPaginate from 'react-paginate';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import ReactQuill from 'react-quill';

const EditStaff = () => {

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
    note: "",
    isDeleted: ""
  });

  const [staff, setStaff] = useState({
    id: "",
  });


  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State variable for modal visibility
  const [centerList, setCenterList] = useState([]);
  const [tutorList, setTutorList] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(0);
  const [centersPerPage] = useState(2);
  const [tutorsPerPage] = useState(2);


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

  useEffect(() => {
    if (id) {
      accountService
        .getStaffByAccountId(id)
        .then((res) => {
          console.log("hello: " + res.data.id)
          setStaff(res.data);
          staffService
            .getAllCentersByStaff(res.data.id)
            .then((res) => {
              // console.log(res.data);
              setCenterList(res.data);

            })
            .catch((error) => {
              console.log(error);
            });
          staffService
            .getAllTutorsByStaff(res.data.id)
            .then((res) => {
              // console.log(res.data);
              setTutorList(res.data);

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


  //list centers
  const filteredCenters = centerList
    .filter((center) => {
      return (
        center.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.description.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.email.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.isActive.toString().toLowerCase().includes(searchTerm.toLowerCase())

      );
    });

  const pageCount = Math.ceil(filteredCenters.length / centersPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * centersPerPage;
  const currentCenters = filteredCenters.slice(offset, offset + centersPerPage);


  //list tutors
  const filteredTutors = tutorList
    .filter((tutor) => {
      return (
        tutor.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

      );
    });

  const pageCount2 = Math.ceil(filteredTutors.length / tutorsPerPage);

  const handlePageClick2 = (data) => {
    setCurrentPage2(data.selected);
  };

  const offset2 = currentPage2 * tutorsPerPage;
  const currentTutors = filteredTutors.slice(offset2, offset2 + tutorsPerPage);



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


  const submitAccount = (e) => {
    e.preventDefault();
    // If the note is not empty, proceed with the form submission
    accountService
      .updateAccount(account.id, account)
      .then((res) => {
        navigate(`/list-staff`);
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
                  <h4 className="header-title">STAFF INFORMATION</h4>

                  <form id="demo-form" data-parsley-validate onSubmit={(e) => submitAccount(e)}>
                    <div className="row">
                      <div className="col-md-8">
                        <div className="table-responsive">
                          <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                            <tbody>
                              <tr>
                                <th>Staff Name:</th>
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


                    <div className="form-group">
                      <label>Is Managing Centers:</label>

                      <div className="table-responsive">
                        <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                          <thead className="thead-light">
                            <tr>
                              <th data-toggle="true">No.</th>
                              <th data-toggle="true">Center Name</th>
                              <th>Email</th>
                              <th data-hide="phone">Description</th>
                              <th data-hide="phone, tablet">Address</th>
                              <th>Is Managed By</th>
                              <th>Status</th>
                              <th>Action</th>
                              <th>Tutors</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              currentCenters.length > 0 && currentCenters.map((cus, index) => (
                                <tr key={cus.id}>
                                  <td>{index + 1}</td>
                                  <td>{cus.name}</td>
                                  <td>{cus.email}</td>
                                  <td>{cus.description}</td>
                                  <td>{cus.address}</td>
                                  <td>{cus.staff && cus.staff.account ? cus.staff.account.fullName : 'Unknown Name'}</td>
                                  <td>
                                    {cus.isActive ? (
                                      <span className="badge label-table badge-success">Active</span>
                                    ) : (
                                      <span className="badge label-table badge-danger">Inactive</span>
                                    )}
                                  </td>
                                  <td>
                                    <Link to={`/edit-center/${cus.id}`} className='text-secondary'>
                                      <i className="fa-regular fa-eye"></i>
                                    </Link>
                                  </td>
                                  <td>
                                    <Link to={`/list-tutor-by-center/${cus.id}`} className='text-dark'>
                                      <i class="ti-more-alt"></i>
                                    </Link>
                                  </td>
                                </tr>
                              ))
                            }

                          </tbody>
                        </table>
                      </div> {/* end .table-responsive*/}
                    </div>
                    {
                      currentCenters.length === 0 && (
                        <p>There are no centers.</p>
                      )
                    }
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

                    <div className="form-group">
                      <label>Is Managing Tutors:</label>

                      <div className="table-responsive">
                        <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                          <thead className="thead-light">
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
                            {
                              currentTutors.length > 0 && currentTutors.map((tutor, index) => (
                                <tr key={tutor.id}>
                                  <td>{index + 1}</td>
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
                              ))
                            }

                          </tbody>
                        </table>
                      </div>
                    </div>
                    {
                      currentTutors.length === 0 && (
                        <p>There are no tutors.</p>
                      )
                    }
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
                          pageCount={pageCount2}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={handlePageClick2}
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
                  </form>
                </div> {/* end card-box*/}
              </div> {/* end col*/}
            </div>
            {/* end row*/}



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

export default EditStaff;
