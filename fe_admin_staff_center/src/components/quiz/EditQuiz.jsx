import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import quizService from '../../services/quiz.service';

const EditQuiz = () => {

  const [quiz, setQuiz] = useState({
    moduleId: "",
    classTopicId: "",
    classPracticeId: "",
    name: "",
    gradeToPass: "",
    deadline: "",
    createdDate: "",
    updatedDate: "",
    module: []
  });


  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const [questionList, setQuestionList] = useState([]);


  const { quizId } = useParams();

  useEffect(() => {
    if (quizId) {
      quizService
        .getQuizById(quizId)
        .then((res) => {
          setQuiz(res.data);
        })
        .catch((error) => {
          console.log(error);
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
                  <h4 className="header-title">QUIZ INFORMATION</h4>

                  <form id="demo-form" data-parsley-validate>
                    <div className="table-responsive">
                      <table className="table table-bordered">
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
                            <td>{quiz.deadline}</td>
                          </tr>
                          <tr>
                            <th>Created Date:</th>
                            <td>{quiz.createdDate}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="form-group">
                      <label>Questions:</label>

                      <ul className="list-group">
                        {questionList.map((question) => (
                          <li key={question.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {question.questionImageUrl} {question.questionAudioUrl} {question.questionText}
                            <button
                              type="button"
                              className="btn btn-link btn-sm text-secondary"
                              onClick={() => handleEditQuestion(question.id)}
                            >
                              <i class="fa-regular fa-eye"></i>

                            </button>
                          </li>
                        ))}

                      </ul>
                    </div>

                    <div className="form-group mb-2">
                      <>
                        {questionList.length === 0 && (
                          <p>No questions available.</p>
                        )}
                        {/* <Link
                          type="button"
                          className="btn btn-success mr-2"
                          to={`/tutor/courses/create/create-video-course/create-question/${quiz.id}`}
                        >
                          <i className="bi bi-plus"></i> Create new question
                        </Link>


                        <button
                          type="submit"
                          className="btn btn-danger"
                        >
                          <i className="bi bi-x-lg"></i> Request to delete
                        </button> */}
                      </>


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
                `}
      </style>
    </>
  )
}

export default EditQuiz;
