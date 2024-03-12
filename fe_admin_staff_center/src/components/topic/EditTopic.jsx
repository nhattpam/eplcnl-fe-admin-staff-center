import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import classLessonService from '../../services/class-lesson.service';
import topicService from '../../services/topic.service';
import classModuleService from '../../services/class-module.service';

const EditTopic = () => {
  const navigate = useNavigate();

  const { storedClassTopicId } = useParams();
  const [createdTopics, setCreatedTopics] = useState([]);
  const [quizList, setQuizList] = useState([]);


  //create class topic
  const [classTopic, setClassTopic] = useState({
    name: "",
    description: "",
    materialUrl: "",
    classLessonId: "",
    classLesson: ""
  });


  const [classLesson, setClassLesson] = useState({
    classHours: '',
    classUrl: '',
    classModuleId: ''
  });

  const [classModule, setClassModule] = useState({
    startDate: '',
  });




  useEffect(() => {
    if (storedClassTopicId) {
      topicService
        .getClassTopicById(storedClassTopicId)
        .then((res) => {
          setClassTopic(res.data);
          console.log(classTopic)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedClassTopicId]);

  useEffect(() => {
    if (storedClassTopicId) {
      topicService
        .getAllQuizzesByClassTopic(storedClassTopicId)
        .then((res) => {
          setQuizList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedClassTopicId]);


  useEffect(() => {
    if (classTopic.classLesson?.classModuleId) {
      classModuleService
        .getModuleById(classTopic.classLesson?.classModuleId)
        .then((res) => {
          setClassModule(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [classTopic.classLesson?.classModuleId]);

  const handleListTopics = () => {
    navigate(`/list-topic/${classTopic.classLessonId}`);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setClassTopic({ ...classTopic, [e.target.name]: value });
  }

  const listTopicsByClassLessonId = async (storedClassLessonId) => {
    try {
      const listClassTopicsByClassLesson = await classLessonService.getAllClassTopicsByClassLesson(storedClassLessonId);

      //   console.log('this is list:', listClassTopicsByClassLesson.data);

      setCreatedTopics(listClassTopicsByClassLesson.data);
    } catch (error) {
      console.log(error);
    }
  };




  const submitClassTopic = async (e) => {
    e.preventDefault();

    try {
      // Save account
      const classTopicResponse = await topicService.saveClassTopic(classTopic);

      // console.log(JSON.stringify(courseResponse));
      // console.log(courseResponse.data);
      const classTopicJson = JSON.stringify(classTopicResponse.data);

      const classTopicJsonParse = JSON.parse(classTopicJson);

      console.log(classTopicJsonParse)

      await listTopicsByClassLessonId(classTopic.classLessonId);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (classTopic.classLessonId) {
      listTopicsByClassLessonId(classTopic.classLessonId);
    }
  }, [classTopic.classLessonId]);
  return (
    <>
      <div id="wrapper">
        <Header />
        <Sidebar isAdmin={sessionStorage.getItem('isAdmin') === 'true'}
          isStaff={sessionStorage.getItem('isStaff') === 'true'}
          isCenter={sessionStorage.getItem('isCenter') === 'true'} />        <div className="content-page">
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="header-title">
                        DATE - <span className='text-success'>{classModule.startDate ? new Date(classModule.startDate).toLocaleDateString('en-US') : "No class time"}</span> | TOPIC INFORMATION
                      </h4>
                      <form
                        method="post"
                        className="mt-3"
                        id="myAwesomeDropzone"
                        data-plugin="dropzone"
                        data-previews-container="#file-previews"
                        data-upload-preview-template="#uploadPreviewTemplate"
                        data-parsley-validate
                        onSubmit={(e) => submitClassTopic(e)}
                      >

                        <div className="form-group">
                          <h2 htmlFor="topic">Topic</h2>

                        </div>
                        <div className="form-group">
                          <label htmlFor="name">Name:</label>
                          <div>
                            {classTopic.name}
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="code">Description:</label>
                          <div>
                            {classTopic.description}
                          </div>
                        </div>



                      </form>

                      {/* Display created topics */}
                      <div className="form-group">
                        <h5>Quizzes:</h5>
                        <>
                          <div className="table-responsive">
                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                              <thead className="thead-light">
                                <tr>
                                  <th data-toggle="true">No.</th>
                                  <th data-hide="phone, tablet">Name</th>
                                  <th data-hide="phone, tablet">Grade To Pass</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {quizList.length > 0 && quizList.map((quiz, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {quiz.name}
                                    </td>
                                    <td>
                                      {quiz.gradeToPass}
                                    </td>
                                    <td>
                                      <Link to={`/edit-quiz/${quiz.id}`} className='text-secondary'>
                                        <i className="fa-regular fa-eye"></i>
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div> {/* end .table-responsive*/}
                        </>


                      </div>
                      {
                        quizList.length === 0 && (
                          <p className='text-center'>There are no quizzes.</p>
                        )
                      }
                      <div className="form-group mb-0">
                        <Link
                          to={`/list-material-by-topic/${classTopic.id}`}
                          className="btn btn-dark"
                        >
                          View Materials
                        </Link>

                        <Link
                          type="button"
                          className="btn btn-black mr-2"
                          to={`/edit-class-module/${classTopic.classLesson.classModuleId}`}
                        >
                          <i class="fas fa-long-arrow-alt-left"></i> Back to Class Infomation
                        </Link>
                      </div>
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
        `}
      </style>
    </>
  );
};

export default EditTopic;
