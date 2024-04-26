import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import quizService from '../../services/quiz.service';

const EditQuiz = () => {

  const [quiz, setQuiz] = useState({
    moduleId: "",
    topicId: "",
    name: "",
    gradeToPass: "",
    deadline: "",
    createdDate: "",
    updatedDate: "",
    module: [],
    topic: []
  });


  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const [questionList, setQuestionList] = useState([]);


  const { quizId } = useParams();

  //LOADING
  const [loading, setLoading] = useState(true); // State to track loading

  //LOADING

  useEffect(() => {
    if (quizId) {
      quizService
        .getQuizById(quizId)
        .then((res) => {
          setQuiz(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [quizId]);

  useEffect(() => {
    quizService
      .getAllQuestionsByQuiz(quizId)
      .then((res) => {
        console.log(res.data);
        setQuestionList(res.data);

      })
      .catch((error) => {
        console.log(error);
      });
  }, [quizId]);




  const handleEditQuestion = (questionId) => {
    // Add logic to navigate to the module edit page with the moduleId
    navigate(`/edit-question/${questionId}`);
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

                  {loading && (
                    <div className="loading-overlay">
                      <div className="loading-spinner" />
                    </div>
                  )}
                  {
                    quiz.moduleId && (
                      <h4 className="header-title">MODULE - <span className='text-success'>{quiz.module?.name}</span> | QUIZ INFORMATION</h4>

                    )
                  }
                  {
                    quiz.topicId && (
                      <h4 className="header-title">TOPIC - <span className='text-success'>{quiz.topic?.name}</span> | QUIZ INFORMATION</h4>

                    )
                  }
                  {loading && (
                    <div className="loading-overlay">
                      <div className="loading-spinner" />
                    </div>
                  )}
                  <form id="demo-form" data-parsley-validate>
                    <div className="table-responsive">
                      <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                        <tbody>
                          <tr>
                            <th>Quiz Name:</th>
                            <td>{quiz.name}</td>
                          </tr>
                          <tr>
                            <th>Grade to Pass:</th>
                            <td><span className="badge label-table badge-success">{quiz.gradeToPass}</span></td>
                          </tr>
                          <tr>
                            <th>Times:</th>
                            <td>{quiz.deadline} mins</td>
                          </tr>
                          <tr>
                            <th>Created Date:</th>
                            <td>{quiz.createdDate}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>


                    <div className="form-group">
                      <h5>Questions:</h5>

                      <div className="table-responsive">
                        <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                          <thead className="thead-light">
                            <tr>
                              <th data-toggle="true">No.</th>
                              <th data-toggle="true">Question</th>
                              <th>Grade</th>
                              <th data-hide="phone">Created Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              questionList.length > 0 && questionList.map((question, index) => (
                                <tr key={question.id}>
                                  <td>{index + 1}</td>
                                  <td>
                                    Question {index + 1}
                                  </td>
                                  <td>{question.defaultGrade}</td>
                                  <td>{question.createdDate}</td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn btn-link btn-sm text-secondary"
                                      onClick={() => handleEditQuestion(question.id)}
                                    >
                                      <i class="fa-regular fa-eye"></i>

                                    </button>
                                  </td>
                                </tr>
                              ))
                            }


                          </tbody>

                        </table>


                      </div>


                    </div>
                    {
                      questionList.length === 0 && (
                        <p className='text-center'>No questions found.</p>
                      )
                    }

                    <div className="form-group mb-2">
                      <>
                        {questionList.length === 0 && (
                          <p>No questions available.</p>
                        )}

                      </>


                    </div>





                  </form>

                </div> {/* end card-box*/}
                {
                  quiz.moduleId && (
                    <Link
                      type="button"
                      className="btn btn-black mr-2"
                      to={`/edit-module/${quiz.moduleId}`}
                    >
                      <i class="fas fa-long-arrow-alt-left"></i> Back to Module Infomation
                    </Link>
                  )
                }
                {
                  quiz.topicId && (
                    <Link
                      type="button"
                      className="btn btn-black mr-2"
                      to={`/edit-topic/${quiz.topicId}`}
                    >
                      <i class="fas fa-long-arrow-alt-left"></i> Back to Topic Infomation
                    </Link>
                  )
                }
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

export default EditQuiz;
