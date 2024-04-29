import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import moduleService from '../../services/module.service';
import assignmentService from '../../services/assignment.service';

const EditAssignment = () => {
  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
  console.log("STatus: " + storedLoginStatus)
  const navigate = useNavigate();
  if (!storedLoginStatus) {
    navigate(`/login`)
  } const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  // const { storedModuleId } = useParams();
  const { assignmentId } = useParams();


  //LOADING
  const [loading, setLoading] = useState(true); // State to track loading

  //LOADING
  //tao assignment
  const [assignment, setAssignment] = useState({
    questionText: "",
    questionAudioUrl: "",
    deadline: "", // set a default value for minutes
    moduleId: "",
    gradeToPass: ""
  });

  useEffect(() => {
    if (assignmentId) {
      assignmentService
        .getAssignmentById(assignmentId)
        .then((res) => {
          setAssignment(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [assignmentId]);


  useEffect(() => {
    if (assignment.moduleId) {
      moduleService
        .getModuleById(assignment.moduleId)
        .then((res) => {
          setModule(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [assignment.moduleId]);



  const [module, setModule] = useState({
    name: "",
  });



  const handleChange = (e) => {
    const value = e.target.value;
    setModule({ ...module, [e.target.name]: value });
  }
  const handleChangeAssignment = (value) => {
    setAssignment({ ...assignment, questionText: value });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (assignment.questionText.trim() === '') {
      errors.questionText = 'Question is required';
      isValid = false;
    }
    if (!assignment.deadline) {
      errors.deadline = 'Time is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };


  const submitAssignment = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Save account
        console.log(JSON.stringify(assignment))
        const assignmentResponse = await assignmentService.saveAssignment(assignment);
        console.log(assignmentResponse.data);

        setMsg('Assignment Added Successfully');

        const assignmentJson = JSON.stringify(assignmentResponse.data);

        const assignmentJsonParse = JSON.parse(assignmentJson);


      } catch (error) {
        console.log(error);
      }
    }
  };


  const handleMinutesChange = (e) => {
    const minutes = parseInt(e.target.value, 10);
    setAssignment({ ...assignment, deadline: minutes });
  };


  return (
    <>
      <div id="wrapper">
        <Header />
        <Sidebar isAdmin={sessionStorage.getItem('isAdmin') === 'true'}
          isStaff={sessionStorage.getItem('isStaff') === 'true'}
          isCenter={sessionStorage.getItem('isCenter') === 'true'} />
        <div className="content-page">
          <div className="content">
            {/* Start Content*/}
            <div className="container-fluid">
              {/* start page title */}
              <div className="row">
                <div className="col-12">
                  <div className="">
                    <div className="card-body">
                      <h4 className="header-title">COURSE - <span className='text-success'>{module.course?.name}</span> | MODULE - <span className='text-success'>{module.name}</span> </h4>

                      {loading && (
                        <div className="loading-overlay">
                          <div className="loading-spinner" />
                        </div>
                      )}
                      <form
                        method="post"
                        className="mt-3"
                        id="myAwesomeDropzone"
                        data-plugin="dropzone"
                        data-previews-container="#file-previews"
                        data-upload-preview-template="#uploadPreviewTemplate"
                        data-parsley-validate
                        onSubmit={submitAssignment} >
                        <div className="card" style={{ marginTop: '-20px' }}>
                          <div className='card-body'>
                            <label htmlFor="video">Time:</label>
                            <div>{assignment.deadline} minutes</div>
                          </div>
                          <div className='card-body'>
                            <label htmlFor="video">Grade To Pass:</label>
                            <div>{assignment.gradeToPass} </div>
                          </div>
                          {assignment.questionText && (
                            <div className='card-body'>
                              <label htmlFor="video">Question Text:</label>
                              <div dangerouslySetInnerHTML={{ __html: assignment.questionText }} />

                            </div>
                          )}

                          {assignment.questionAudioUrl && (
                            <div className='card-body'>
                              <label htmlFor="video">Question Audio:</label>
                              <div>
                                <audio controls>
                                  <source src={assignment?.questionAudioUrl} type="audio/mpeg" />
                                  Your browser does not support the audio element.
                                </audio>
                              </div>

                            </div>
                          )}
                        </div>
                        {/* <div className="form-group mb-0  ">
                          <button type="submit" className="btn btn-primary " style={{ marginLeft: '23px', marginTop: '10px' }} >
                            Edit
                          </button>
                        </div> */}
                        <Link
                          type="button"
                          className="btn btn-black mr-2"
                          to={`/edit-module/${assignment.moduleId}`}
                        >
                          <i class="fas fa-long-arrow-alt-left"></i> Back to Module Infomation
                        </Link>
                      </form>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          </div>
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
  );
};

export default EditAssignment;
