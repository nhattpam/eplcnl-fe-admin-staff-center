import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../Footer'
import Header from '../../Header'
import Sidebar from '../../Sidebar'
import { Link } from 'react-router-dom'
import moduleService from '../../../../services/module.service';

const ListQuiz = () => {

    const { storedModuleId } = useParams();
    const [quizList, setQuizList] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [quizsPerPage] = useState(5);


    const [module, setModule] = useState({
        name: '',
    });


    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        if (storedModuleId) {
            moduleService
                .getModuleById(storedModuleId)
                .then((res) => {
                    setModule(res.data);
                    // console.log(module)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [storedModuleId]);

    useEffect(() => {
        moduleService
            .getAllQuizzesByModule(storedModuleId)
            .then((res) => {
                console.log(res.data);
                setQuizList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [storedModuleId]);

    const filteredQuizs = quizList
        .filter((quiz) => {
            return (
                quiz.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredQuizs.length / quizsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * quizsPerPage;
    const currentQuizs = filteredQuizs.slice(offset, offset + quizsPerPage);

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
                                        <h4 className="page-title">List Quiz Of Module {module.name}</h4>
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
                                                    <Link to={`/tutor/courses/create/create-video-course/create-quiz/${storedModuleId}`} className="btn btn-primary">
                                                        Create
                                                    </Link>
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
                                                        <th data-toggle="true">Quiz Name</th>
                                                        <th>Description</th>
                                                        <th data-hide="phone">Created Date</th>
                                                        <th data-hide="phone, tablet">Updated Date</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentQuizs.map((quiz) => (
                                                        <tr key={quiz.id}>
                                                            <td>{quiz.name}</td>
                                                            <td>{quiz.description}</td>
                                                            <td>{quiz.createdDate}</td>
                                                            <td>{quiz.updatedDate}</td>
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

export default ListQuiz