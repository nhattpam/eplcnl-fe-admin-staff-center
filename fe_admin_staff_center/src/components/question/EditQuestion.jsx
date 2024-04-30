import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import questionService from '../../services/question.service';
import questionAnswerService from '../../services/question-answer.service';

const EditQuestion = () => {

    const [question, setQuestion] = useState({
        questionText: "",
        questionImageUrl: "",
        questionAudioUrl: "",
        defaultGrade: 0,
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    console.log("STatus: " + storedLoginStatus)
    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }
    const [questionAnswerList, setQuestionAnswerList] = useState([]);


    const { questionId } = useParams();

    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

    useEffect(() => {
        if (questionId) {
            questionService
                .getQuestionById(questionId)
                .then((res) => {
                    setQuestion(res.data);
                    setLoading(false);

                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);

                });
        }
    }, [questionId]);

    useEffect(() => {
        questionService
            .getAllQuestionAnswersByQuestion(questionId)
            .then((res) => {
                console.log(res.data);
                setQuestionAnswerList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [questionId]);





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
                                    <h4 className="header-title">QUESTION INFORMATION</h4>

                                    {loading && (
                                        <div className="loading-overlay">
                                            <div className="loading-spinner" />
                                        </div>
                                    )}
                                    <form id="demo-form" data-parsley-validate>
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-2" data-page-size={7}>
                                                <tbody>
                                                    {question.questionText && (
                                                        <tr>
                                                            <th style={{ fontWeight: 'bold' }}>Question Text</th>
                                                            <td dangerouslySetInnerHTML={{ __html: question.questionText }} />
                                                        </tr>
                                                    )}

                                                    {question.questionImageUrl && (
                                                        <tr>
                                                            <th>Question Image</th>
                                                            <td><img src={question.questionImageUrl} style={{ width: '300px', height: '150px' }}></img></td>
                                                        </tr>
                                                    )}
                                                    {question.questionAudioUrl && (
                                                        <tr>
                                                            <th>Question Audio</th>
                                                            <td>
                                                                <audio controls>
                                                                    <source src={question.questionAudioUrl} type="audio/mpeg" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            </td>
                                                        </tr>
                                                    )}

                                                    <tr>
                                                        <th>Grade</th>
                                                        <td>
                                                            <span className="badge label-table badge-danger">{question.defaultGrade}</span>
                                                        </td>
                                                    </tr>
                                                  
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="form-group">
                                            <label>Answers:</label>

                                            <ul className="list-group">
                                                {
                                                    questionAnswerList.length > 0 && questionAnswerList.map((questionAnswer) => (
                                                        <li key={questionAnswer.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ border: 'none', borderBottom: '1px solid #dee2e6' }}>
                                                            {questionAnswer.answerText} {questionAnswer.isAnswer && (
                                                                <span>This is answer</span>
                                                            )}
                                                        </li>
                                                    ))
                                                }


                                            </ul>
                                        </div>

                                        <div className="form-group mb-2">
                                            <>
                                                {questionAnswerList.length === 0 && (
                                                    <p className='text-center mt-3'>No answers available.</p>
                                                )}
                                            </>


                                        </div>





                                    </form>
                                </div> {/* end card-box*/}
                                <Link
                                    type="button"
                                    className="btn btn-black mr-2"
                                    to={`/edit-quiz/${question.quizId}`}
                                >
                                    <i class="fas fa-long-arrow-alt-left"></i> Back to Quiz Infomation
                                </Link>

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

export default EditQuestion;
