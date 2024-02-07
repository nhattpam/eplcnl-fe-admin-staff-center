import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import classLessonService from '../../services/class-lesson.service';
import classTopicService from '../../services/class-topic.service';
import classModuleService from '../../services/class-module.service'; 

const EditTopic = () => {
  const navigate = useNavigate();
  
  const { storedClassTopicId } = useParams();
  const [createdTopics, setCreatedTopics] = useState([]);

  
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
      classTopicService
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
      const classTopicResponse = await classTopicService.saveClassTopic(classTopic);

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
        <Sidebar />
        <div className="content-page">
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="header-title">
                         Date {classModule.startDate}
                      </h4>
                      <form
                        method="post"
                        className="dropzone"
                        id="myAwesomeDropzone"
                        data-plugin="dropzone"
                        data-previews-container="#file-previews"
                        data-upload-preview-template="#uploadPreviewTemplate"
                        data-parsley-validate
                        onSubmit={(e) => submitClassTopic(e)}
                      >
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="classHours"
                            id="classHours"
                            value={classTopic.classLesson?.classHours}
                          />
                        </div>


                        <div className="form-group">
                          <label htmlFor="roomLink">Room Link * :</label>
                          <input
                            type="text"
                            className="form-control"
                            name="roomLink"
                            id="roomLink"
                            value={classTopic.classLesson?.classUrl}
                            o
                          />
                        </div>

                        <div className="form-group">
                          <h2 htmlFor="topic">Topic</h2>

                        </div>
                        <div className="form-group">
                          <label htmlFor="name">Name * :</label>
                          <input type="text" className="form-control" name="name" id="name" value={classTopic.name} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="code">Description * :</label>
                          <input type="text" className="form-control" name="description" id="description" value={classTopic.description} onChange={(e) => handleChange(e)} />
                        </div>
                        {/* <div className="form-group">
                          <label htmlFor="code">Materials * :</label>
                          <input type="text" className="form-control" name="materialUrl" id="materialUrl" value={classTopic.materialUrl} onChange={(e) => handleChange(e)} />
                        </div> */}
                        <div className="form-group mb-0">
                          <button
                            type="submit"
                            className="btn btn-primary mr-2"
                          >
                            Update Topic
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary mr-2"
                            onClick={handleListTopics}
                          >
                            List Topics
                          </button>
                          <Link
                            to={`/list-material-by-topic/${classTopic.id}`}
                            className="btn btn-warning"
                          >
                            View Materials
                          </Link>
                        </div>
                      </form>

                      {/* Display created topics */}
                      <div>
                        <h4>Created Topics:</h4>
                        {Array.isArray(createdTopics) && createdTopics.length > 0 ? (
                          <ul>
                            {createdTopics.map((topic) => (
                              <li key={topic.id}>{topic.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No topics created yet.</p>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  );
};

export default EditTopic;
