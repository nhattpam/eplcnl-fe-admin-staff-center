import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { Link } from 'react-router-dom'
import classLessonService from '../../services/class-lesson.service';
import topicService from '../../services/topic.service';
import lessonService from '../../services/lesson.service';

const ListLessonMaterial = () => {
  const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
  console.log("STatus: " + storedLoginStatus)
  const navigate = useNavigate();
  if (!storedLoginStatus) {
      navigate(`/login`)
  }
  const { storedLessonId } = useParams();
  const [materialList, setMaterialList] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [materialsPerPage] = useState(5);


  const [lessonMaterial, setLessonMaterial] = useState({
    name: '',
    materialUrl: '',
    createdDate: '',
    updatedDate: ''
  });

  useEffect(() => {
    if (storedLessonId) {
      lessonService
        .getAllMaterialsByLesson(storedLessonId)
        .then((res) => {
          setMaterialList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [storedLessonId]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  const filteredLessonMaterials = materialList
    .filter((material) => {
      return (
        material.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

      );
    });

  const pageCount = Math.ceil(filteredLessonMaterials.length / materialsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * materialsPerPage;
  const currentLessonMaterials = filteredLessonMaterials.slice(offset, offset + materialsPerPage);

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
                    {/* <h4 className="page-title">List Topic Of Lesson {classLesson.classHours}</h4> */}
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
                          {/* Create Tutor Button */}
                          {/* <Link to={`/tutor/courses/create-lesson-material/${storedLessonId}`} className="btn btn-primary">
                            Add Material
                          </Link> */}

                          <div className="form-group">
                            <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                        <thead className="thead-light">
                          <tr>
                            <th data-toggle="true">Material Name</th>
                            <th data-hide="phone">Created Date</th>
                            <th data-hide="phone, tablet">Updated Date</th>
                            <th>File</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentLessonMaterials.length > 0 && currentLessonMaterials.map((material) => (
                            <tr key={material.id}>
                              <td>{material.name}</td>
                            


                              <td>{material.createdDate}</td>
                              <td>{material.updatedDate}</td>
                              <td>
                                <a href={material.materialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-success">View</a>
                              </td>
                            </tr>
                          ))}


                        </tbody>

                      </table>

                    </div> {/* end .table-responsive*/}

                  </div> {/* end card-box */}
                  {currentLessonMaterials.length === 0 && (
                    <p>No materials yet.</p>
                  )}
                </div> {/* end col */}
              </div>
              {/* end row */}



            </div> {/* container */}
          </div> {/* content */}
        </div>
        {/* ============================================================== */}
        {/* End Page content */}
        {/* ============================================================== */}

      </div >

    </>
  )
}

export default ListLessonMaterial