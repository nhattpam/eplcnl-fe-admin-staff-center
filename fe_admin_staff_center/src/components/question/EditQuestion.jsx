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
    const navigate = useNavigate();

    const [questionAnswerList, setQuestionAnswerList] = useState([]);


    const { questionId } = useParams();

    useEffect(() => {
        if (questionId) {
            questionService
                .getQuestionById(questionId)
                .then((res) => {
                    setQuestion(res.data);
                })
                .catch((error) => {
                    console.log(error);
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




    const handleDeleteQuestionAnswer = async (questionAnswerId) => {
        try {
            // Delete the question answer
            const response = await questionAnswerService.deleteQuestionAnswer(questionAnswerId);
            console.log(response)
            // Reload the question answer list
            const updatedQuestionAnswerList = await questionService.getAllQuestionAnswersByQuestion(questionId);
            setQuestionAnswerList(updatedQuestionAnswerList.data);

            // Optionally, display a success message
            setMsg('Question answer deleted successfully');
        } catch (error) {
            console.error('Error deleting question answer:', error);
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
                                    <h4 className="header-title">Course Information</h4>

                                    <form id="demo-form" data-parsley-validate>
                                        <div className="form-group">
                                            <label htmlFor="name">Question Text * :</label>
                                            <input type="text" className="form-control" name="questionText" id="questionText" value={question.questionText} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="name">Question Image * :</label>
                                            <input type="text" className="form-control" name="questionImageUrl" id="questionImageUrl" value={question.questionImageUrl} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="name">Question Audio * :</label>
                                            <input type="text" className="form-control" name="questionAudioUrl" id="questionAudioUrl" value={question.questionAudioUrl} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="code">Grade * :</label>
                                            <input type="number" id="code" className="form-control" name="gradeToPasscode" data-parsley-trigger="change" value={question.defaultGrade} readOnly />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="tags">Created Date * :</label>
                                            <input type="text" id="createdDate" className="form-control" name="createdDate" data-parsley-trigger="change" value={question.createdDate} readOnly />
                                        </div>

                                        <div className="form-group">
                                            <label>Answers:</label>

                                            <ul className="list-group">
                                                {questionAnswerList.map((questionAnswer) => (
                                                    <li key={questionAnswer.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {questionAnswer.answerText}
                                                        {/* <Link
                                                            onClick={() => handleDeleteQuestionAnswer(questionAnswer.id)}
                                                        >
                                                            <i class="far fa-trash-alt"></i>
                                                        </Link> */}
                                                    </li>
                                                ))}

                                            </ul>
                                        </div>

                                        <div className="form-group mb-2">
                                            <>
                                                {questionAnswerList.length === 0 && (
                                                    <p>No answers available.</p>
                                                )}
                                                {/* <Link
                                                    type="button"
                                                    className="btn btn-success mr-2"
                                                    to={`/tutor/courses/create/create-video-course/create-question-answer/${question.id}`}
                                                >
                                                    <i className="bi bi-plus"></i> Create new answer
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
                <Footer />
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

export default EditQuestion;
