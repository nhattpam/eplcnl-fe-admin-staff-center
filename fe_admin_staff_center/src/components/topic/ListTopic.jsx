import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { Link } from 'react-router-dom'
import classLessonService from '../../services/class-lesson.service';

const ListTopic = () => {

  const { storedClassLessonId } = useParams();
  const [classTopicList, setClassTopicList] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [classTopicsPerPage] = useState(5);


  const [classLesson, setClassLesson] = useState({
    classHours: '',
    classUrl: '',
  });

  useEffect(() => {
    if (storedClassLessonId) {
      classLessonService
        .getClassLessonById(storedClassLessonId)
        .then((res) => {
          setClassLesson(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedClassLessonId]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    classLessonService
      .getAllClassTopicsByClassLesson(storedClassLessonId)
      .then((res) => {
        console.log(res.data);
        setClassTopicList(res.data);

      })
      .catch((error) => {
        console.log(error);
      });
  }, [storedClassLessonId]);

  const filteredClassTopics = classTopicList
    .filter((classTopic) => {
      return (
        classTopic.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

      );
    });

  const pageCount = Math.ceil(filteredClassTopics.length / classTopicsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * classTopicsPerPage;
  const currentClassTopics = filteredClassTopics.slice(offset, offset + classTopicsPerPage);

  return (
    <>
      <div id="wrapper">
        <Header />
        <Sidebar isAdmin={sessionStorage.getItem('isAdmin') === 'true'}
                    isStaff={sessionStorage.getItem('isStaff') === 'true'}
                    isCenter={sessionStorage.getItem('isCenter') === 'true'} />
        {/* ============================================================== */}
        {/* Start Page Content here */}
        {/* ============================================================== */}
        <div className="content-page">
          <div className="content">
            {/* Start Content*/}
            <div className="container-fluid">
              {/* start page title */}
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box">
                    <div className="page-title-right">
                      <ol className="breadcrumb m-0">
                      </ol>
                    </div>
                    <h4 className="page-title">List Topic Of Lesson {classLesson.classHours}</h4>
                  </div>
                </div>
              </div>
              {/* end page title */}
              <div className="row">
                <div className="col-12">
                  <div className="card-box">
                    <div className="mb-2">
                      <div className="row">
                        <div className="col-12 text-sm-center form-inline">
                          <div className="form-group mr-2">
                            <select id="demo-foo-filter-status" className="custom-select custom-select-sm">
                              <option value>Show all</option>
                              <option value="active">Active</option>
                              <option value="disabled">Disabled</option>
                              <option value="suspended">Suspended</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table id="demo-foo-filtering" className="table table-bordered toggle-circle mb-0" data-page-size={7}>
                        <thead>
                          <tr>
                            <th data-toggle="true">Topic Name</th>
                            <th>Description</th>
                            <th data-hide="phone">Created Date</th>
                            <th data-hide="phone, tablet">Updated Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentClassTopics.map((classTopic) => (
                            <tr key={classTopic.id}>
                              <td>{classTopic.name}</td>
                              <td>{classTopic.description}</td>
                              <td>{classTopic.createdDate}</td>
                              <td>{classTopic.updatedDate}</td>
                              <td>
                                <Link to={"/tutor/courses/create/create-class-course/edit-topic"}>
                                  <i class="fa-regular fa-eye"></i>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>

                      </table>
                    </div> {/* end .table-responsive*/}
                  </div> {/* end card-box */}
                </div> {/* end col */}
              </div>
              {/* end row */}



            </div> {/* container */}
          </div> {/* content */}
        </div>
        {/* ============================================================== */}
        {/* End Page content */}
        {/* ============================================================== */}

        <Footer />
      </div>
    </>
  )
}

export default ListTopic