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
import ReactQuill from 'react-quill';
import learnerService from '../../services/learner.service';


const EditLearner = () => {

  const [payout, setPayout] = useState(0);

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
  const [showModal, setShowModal] = useState(false); // State variable for modal visibility
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



          const learnerEnrollments = enrollmentData.filter(enrollment => enrollment.transaction?.learnerId === learnerData.id && enrollment.refundStatus === false);
          console.log("LENGH: " + learnerEnrollments.length)
          setEnrollmentList(learnerEnrollments);

          const learnersCounts = {}; // Object to store number of learners for each course
          const scores = {}; // Object to store scores for each enrollment

          for (const enrollment of learnerEnrollments) {
            try {

              //CHECK PROGRESSING
              if (!enrollment.transaction?.course?.isOnlineClass) {
                const courseScoreResponse = await enrollmentService.getCourseScoreByEnrollmentId(enrollment.id);
                const learningScoreResponse = await enrollmentService.getLearningScoreByEnrollmentId(enrollment.id);

                scores[enrollment.id] = {
                  courseScore: courseScoreResponse.data,
                  learningScore: learningScoreResponse.data
                };

                // console.log("Course score for enrollment ID " + enrollment.id + ": " + courseScoreResponse.data);
              }
            } catch (error) {
              console.error(`Error fetching learners for course ${enrollment.course?.name}:`, error);
            }
          }

          setEnrollmentScores(scores); // Update state with scores for each enrollment

        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  // Use useEffect to ensure enrollmentList is updated before calculating payout
  useEffect(() => {
    let payout = 0;
    enrollmentList.forEach((enrollment) => {
      if (enrollment.transaction && enrollment.transaction.course && enrollment.transaction.course.stockPrice) {
        payout += enrollment.transaction.course.stockPrice;
      }
    });
    console.log("Payout: " + payout);
    setPayout(payout); // Update the payout state
  }, [enrollmentList]); // Trigger the effect whenever enrollmentList changes


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

  const submitAccount = (e) => {
    e.preventDefault();

    accountService
      .updateAccount(account.id, account)
      .then((res) => {
        navigate("/list-learner/");
        if (account.isActive === false) {
          accountService.sendMailBanAccount(account.id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
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


  //ENROLLMENT SCORE
  const [enrollmentScores, setEnrollmentScores] = useState({});


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

                  <form id="demo-form" data-parsley-validate onSubmit={(e) => submitAccount(e)}>
                    <div className="row">
                      <div className="col-md-8">
                        <div className="table-responsive">
                          <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-2" data-page-size={7}>
                            <tbody>
                              <tr>
                                <th>Learner Name:</th>
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
                              <tr>
                                <th>Total Payout:</th>
                                <td>
                                  ${payout}
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
                            className="btn btn-success " onClick={handleActiveClick}
                            style={{ borderRadius: '50px', padding: `8px 25px` }}
                          >
                            <i class="fas fa-thumbs-up"></i>
                          </button>


                          <button
                            type="button"
                            className="btn btn-danger ml-1" onClick={handleDeleteClick}
                            style={{ borderRadius: '50px', padding: `8px 25px` }}
                          >
                            <i class="fa-solid fa-user-xmark"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {showModal && (
                      <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
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
                              <button type="button" className="btn btn-dark" style={{ color: '#fff', borderRadius: '50px', padding: `8px 25px` }} onClick={() => setShowModal(false)}>Close</button>
                              <button type="button" className="btn btn-danger" style={{ color: '#fff', borderRadius: '50px', padding: `8px 25px` }} onClick={(e) => submitAccount(e)}>Disable</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      <label>Enrolling Courses:</label>
                      <div className="table-responsive">
                        <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                          <thead className="thead-light">
                            <tr>
                              <th data-toggle="true">No.</th>
                              <th data-toggle="true">Course Image</th>
                              <th data-toggle="true">Course Name</th>
                              <th data-toggle="true">Enrolled Date</th>
                              <th data-hide="phone">Status</th>
                              <th data-hide="phone, tablet">Progressing Grade</th>
                            </tr>
                          </thead>
                          <tbody>

                            {
                              currentEnrollments.length > 0 && currentEnrollments.map((cus, index) => (

                                <tr>
                                  <td>{index + 1}</td>
                                  <td>
                                    <img src={cus.transaction?.course?.imageUrl} style={{ height: '70px', width: '100px' }}>

                                    </img>
                                  </td>
                                  <td>
                                    <Link to={`/edit-course/${cus.transaction?.courseId}`} className='text-success'>
                                      {cus.transaction?.course?.name}
                                    </Link>
                                  </td>
                                  {/* <td>{cus.name}</td> */}
                                  <td>{cus.enrolledDate}</td>
                                  <td>{cus.transaction.status}</td>

                                  {!cus.transaction?.course?.isOnlineClass && (
                                    <>
                                      {!cus.transaction?.course?.isOnlineClass && enrollmentScores[cus.id] && (
                                        <>
                                          <td>{enrollmentScores[cus.id]?.learningScore} scores</td>
                                        </>
                                      )}
                                    </>
                                  )}
                                  {!cus.transaction?.course?.isOnlineClass && (
                                    <>

                                    </>
                                  )}


                                </tr>
                              ))
                            }

                          </tbody>


                        </table>
                      </div> {/* end .table-responsive*/}

                    </div>

                  </form>
                  {
                    currentEnrollments.length === 0 && (
                      <p className='text-center'>Learner hasn't joined any courses yet.</p>
                    )
                  }
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
