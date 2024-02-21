import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import accountService from '../../services/account.service';
import enrollmentService from '../../services/enrollment.service';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

const EditLearner = () => {

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

  const [learner, setLearner] = useState({
    id: "",
  });

  const [enrollmentList, setEnrollmentList] = useState([]);



  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [enrollmentsPerPage] = useState(5);

  const { id } = useParams(); //accountId

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const accountResponse = await accountService.getAccountById(id);
          const accountData = accountResponse.data;
          setAccount(accountData);

          const learnerResponse = await accountService.getLearnerByAccountId(accountData.id);
          const learnerData = learnerResponse.data;
          setLearner(learnerData);

          const enrollmentResponse = await enrollmentService.getAllEnrollment();
          const enrollmentData = enrollmentResponse.data;

          const learnerEnrollments = enrollmentData.filter(enrollment => enrollment.learnerId === learnerData.id);
          setEnrollmentList(learnerEnrollments);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);


  const filteredEnrollments = enrollmentList
    .filter((enrollment) => {
      return (
        enrollment.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

      );
    });

  const pageCount = Math.ceil(filteredEnrollments.length / enrollmentsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * enrollmentsPerPage;
  const currentEnrollments = filteredEnrollments.slice(offset, offset + enrollmentsPerPage);


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
                  <h4 className="header-title">LEARNER INFORMATION</h4>

                  <form id="demo-form" data-parsley-validate>
                    <div className="row">
                      <div className="col-md-8">
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
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-0">
                          <button
                            type="submit"
                            className="btn btn-danger"
                          >
                            <i class="fa-solid fa-user-xmark"></i> Delete
                          </button>

                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Is Enrolling Courses:</label>
                      <div className="table-responsive">
                        <table id="demo-foo-filtering" className="table table-bordered toggle-circle mb-0" data-page-size={7}>
                          <thead>
                            <tr>
                              <th data-toggle="true">Course Image</th>
                              <th data-toggle="true">Course Name</th>
                              <th data-toggle="true">Enrolled Date</th>
                              <th data-hide="phone">Status</th>
                              <th data-hide="phone, tablet">Total Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentEnrollments.map((cus) => (

                              <tr>
                                <td>
                                  <img src={cus.course.imageUrl} style={{ height: '70px', width: '100px' }}>

                                  </img>
                                </td>
                                <td>
                                  <Link to={`/edit-course/${cus.courseId}`} className='text-success'>
                                    {cus.course.name}
                                  </Link>
                                </td>
                                {/* <td>{cus.name}</td> */}
                                <td>{cus.enrolledDate}</td>
                                <td>{cus.status}</td>
                                <td>{cus.totalGrade}</td>
                              </tr>
                            ))}
                          </tbody>

                        </table>
                      </div> {/* end .table-responsive*/}

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
                    <IconContext.Provider value={{ color: "#000", size: "12px" }}>
                      <AiFillCaretLeft />
                    </IconContext.Provider>
                  }
                  nextLabel={
                    <IconContext.Provider value={{ color: "#000", size: "12px" }}>
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

export default EditLearner;
