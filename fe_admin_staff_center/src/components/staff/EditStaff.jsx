import { React, useState, useEffect, useRef } from "react";
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
import { Chart, PieController, ArcElement, registerables } from "chart.js";

const EditStaff = () => {

  Chart.register(PieController, ArcElement);
  Chart.register(...registerables);
  const pieChartRef = useRef(null);
  const areaChartRef = useRef(null);

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
    isDeleted: "",
  });

  const [staff, setStaff] = useState({
    id: "",
  });


  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
  console.log("STatus: " + storedLoginStatus)
  const navigate = useNavigate();
  if (!storedLoginStatus) {
      navigate(`/login`)
  }  const [showModal, setShowModal] = useState(false); // State variable for modal visibility
  const [centerList, setCenterList] = useState([]);
  const [tutorList, setTutorList] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(0);
  const [centersPerPage] = useState(2);
  const [tutorsPerPage] = useState(2);

  const [salaryList, setSalaryList] = useState([]);


  const { id } = useParams();

  //LOADING
  const [loading, setLoading] = useState(true); // State to track loading

  //LOADING


  useEffect(() => {
    if (id) {
      accountService
        .getAccountById(id)
        .then((res) => {
          setAccount(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
      accountService
        .getAllSalariesByAccount(id)
        .then((res) => {
          setSalaryList(res.data);
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
        if (account.isActive === false) {
          accountService.sendMailBanAccount(account.id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //SALARY
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const openSalaryModal = () => {
    setShowSalaryModal(true);
  };

  const closeSalaryModal = () => {
    setShowSalaryModal(false);
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const renderSalaryTable = () => {
    // Filter salary list for the selected year
    const filteredSalaries = salaryList.filter(salary => salary.year === selectedYear);

    return (
      <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
        <thead className="thead-light">
          <tr>
            {months.map((month, index) => (
              <th key={index}>{month}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {months.map((month, index) => {
              // Find the salary for the current month
              const salaryForMonth = filteredSalaries.find(salary => salary.month === index + 1);
              return (
                <td key={index}>
                  {salaryForMonth ? `$${salaryForMonth.amount.toFixed(2)}` : '-'}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    );
  };


  //COMPARE
  useEffect(() => {
    // Call createAreaChart whenever selectedYear changes or modal is shown
    createAreaChart();
  }, [selectedYear, renderSalaryTable]);



  const createAreaChart = () => {
    if (areaChartRef.current) {
      const areaChartCanvas = areaChartRef.current.getContext("2d");

      if (areaChartRef.current.chart) {
        areaChartRef.current.chart.destroy();
      }

      // Filter salary data for the selected year
      const filteredSalaries = salaryList.filter(salary => salary.year === selectedYear);

      // Extract salary for each month
      const salaryByMonth = Array.from({ length: 12 }, (_, index) => {
        const salaryForMonth = filteredSalaries.find(salary => salary.month === index + 1);
        return salaryForMonth ? salaryForMonth.amount : 0;
      });

      const data = {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Income",
            data: salaryByMonth, // Use salary data for each month
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(54, 162, 235, 1)",
            pointBorderColor: "#fff",
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };

      const options = {
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              borderWidth: 1,
              borderDash: [2],
              borderDashOffset: [2],
              drawBorder: false,
              color: "rgba(0, 0, 0, 0.05)",
              zeroLineColor: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              callback: (value) => {
                if (value >= 1000) {
                  return `$${value / 1000}k`;
                }
                return `$${value}`;
              },
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label;
                const value = context.formattedValue;
                return `${label}: $${value}`;
              },
            },
          },
        },
      };

      areaChartRef.current.chart = new Chart(areaChartCanvas, {
        type: "line",
        data: data,
        options: options,
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
                  <h4 className="header-title">STAFF INFORMATION</h4>
                  {loading && (
                    <div className="loading-overlay">
                      <div className="loading-spinner" />
                    </div>
                  )}
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
                              <tr>
                                <th>Joined Date:</th>
                                <td>{new Date(account.createdDate).toLocaleString('en-US')}</td>
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
                              <button type="button" className="btn btn-dark" onClick={() => setShowModal(false)} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
                              <button type="button" className="btn btn-danger" onClick={(e) => submitAccount(e)} style={{ borderRadius: '50px', padding: `8px 25px` }}>Disable</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}


                    <div className="form-group">
                      <label>Managing Centers:</label>

                      <div className="table-responsive">
                        <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                          <thead className="thead-light">
                            <tr>
                              <th data-toggle="true">No.</th>
                              <th data-toggle="true">Center Name</th>
                              <th>Email</th>
                              <th data-hide="phone">Description</th>
                              <th data-hide="phone, tablet">Address</th>
                              <th>Managed By</th>
                              <th>Status</th>
                              <th>Action</th>
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
                                  <td>{cus.staff && cus.staff?.account ? cus.staff?.account?.fullName : 'Unknown Name'}</td>
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

                                </tr>
                              ))
                            }

                          </tbody>
                        </table>
                      </div> {/* end .table-responsive*/}
                    </div>
                    {
                      currentCenters.length === 0 && (
                        <p className='text-center'>No centers found.</p>
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
                      <label>Managing Tutors:</label>

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

                                </tr>
                              ))
                            }

                          </tbody>
                        </table>
                      </div>
                    </div>
                    {
                      currentTutors.length === 0 && (
                        <p className='text-center'>No tutors found.</p>
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
                    <label>Salaries:</label>

                    <div className='form-group'>
                      {/* Salary */}
                      <div style={{ float: 'left', marginRight: '20px', marginBottom: '5px' }}>
                        {/* Year selection dropdown */}
                        <select className="form-select" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                          {[...Array(5).keys()].map((_, index) => (
                            <option key={index} value={new Date().getFullYear() - index}>{new Date().getFullYear() - index}</option>
                          ))}
                        </select>
                      </div>
                      {/* Render salary table based on selected year */}
                      {renderSalaryTable()}
                      <div className="chart-area">
                        <canvas ref={areaChartRef} id="myAreaChart" />
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

                  .form-select {
                    display: block;
                    width: 100%;
                    padding: 0.375rem 1.75rem 0.375rem 0.75rem;
                    font-size: 1rem;
                    font-weight: 400;
                    line-height: 1.5;
                    color: #495057;
                    background-color: #fff;
                    background-clip: padding-box;
                    border: 1px solid #ced4da;
                    border-radius: 0.25rem;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                  }
                  
                  .form-select:focus {
                    border-color: #80bdff;
                    outline: 0;
                    box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
                  }

                  .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backdrop-filter: blur(10px); /* Apply blur effect */
                    -webkit-backdrop-filter: blur(10px); /* For Safari */
                    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999; /* Ensure it's on top of other content */
                }
                
                .loading-spinner {
                    border: 8px solid rgba(245, 141, 4, 0.1); /* Transparent border to create the circle */
                    border-top: 8px solid #f58d04; /* Orange color */
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite; /* Rotate animation */
                }
                
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                `}
      </style>
    </>
  )
}

export default EditStaff;
