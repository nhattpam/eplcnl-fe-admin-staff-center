import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moduleService from '../../services/module.service';
import classModuleService from '../../services/class-module.service';
import classLessonService from '../../services/class-lesson.service';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

const EditClassModule = () => {
    const [module, setModule] = useState({
        startDate: "",
        classHours: "",
        classLesson: ""
    });

    const [errors, setErrors] = useState({});
    const [classTopicList, setClassTopicList] = useState([]);

    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const { moduleId } = useParams();

    useEffect(() => {
        if (moduleId) {
            classModuleService
                .getModuleById(moduleId)
                .then((res) => {
                    setModule(res.data);
                    // console.log(module)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [moduleId]);

    useEffect(() => {
        classLessonService
            .getAllClassTopicsByClassLesson(module.classLesson.id)
            .then((res) => {
                // console.log(res.data);
                setClassTopicList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [module.classLesson.id]);

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
                                    <h4 className="header-title">COURSE - <span className='text-success'>{module.course?.name}</span>  | CLASS INFORMATION</h4>

                                    <form id="demo-form" data-parsley-validate>
                                        <div className="form-group">
                                            <label htmlFor="name">Start Time </label>
                                            <input type="text" className="form-control"
                                                name="startDate" id="startDate" value={module.startDate.substring(0, 10)} readOnly style={{ width: '20%' }} />
                                        </div>

                                        <div className="form-group">
                                            <h5>Class Hours </h5>
                                            <ul>
                                                {module.classLesson.classHours}
                                            </ul>
                                        </div>

                                        <div className="form-group">
                                            <h5>Class Url</h5>
                                            <ul>
                                                {module.classLesson.classUrl}
                                            </ul>
                                        </div>

                                        <div className="form-group">
                                            <h5>Topics</h5>
                                            {
                                                classTopicList.length > 0 && classTopicList.map((classTopic) => (
                                                    <ul>
                                                        {classTopic.name} &nbsp;
                                                        <Link to={`/edit-topic/${classTopic.id}`} className='text-secondary'>  <i class="fa-regular fa-eye"></i></Link>
                                                    </ul>
                                                ))
                                            }


                                        </div>

                                    </form>
                                </div> {/* end card-box*/}
                                {
                                    classTopicList.length === 0 && (
                                        <p>There are no topics.</p>
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
                `}
            </style>
        </>
    );
}

export default EditClassModule;
