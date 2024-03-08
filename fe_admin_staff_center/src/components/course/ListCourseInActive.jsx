import React, { useEffect, useState } from 'react';
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai"; // icons form react-icons
import courseService from '../../services/course.service';
import staffService from '../../services/staff.service';

const ListCourseInActive = () => {

    const [courseList, setCourseList] = useState([]);
    const [msg, setMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [coursesPerPage] = useState(5);

    const { staffId } = useParams();


    useEffect(() => {
        staffService
            .getAllCoursesByStaff(staffId)
            .then((res) => {
                // Filter the courses where isActive is true
                const activeCourses = res.data.filter(course => course.isActive === false);
                console.log(activeCourses);
                setCourseList(activeCourses);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);



    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCourses = courseList
        .filter((course) => {
            return (
                course.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredCourses.length / coursesPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * coursesPerPage;
    const currentCourses = filteredCourses.slice(offset, offset + coursesPerPage);

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
                                        <h4 className="page-title">LIST OF INACTIVE COURSES</h4>
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
                                                    <div className="form-group">
                                                        <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" value={searchTerm}
                                                            onChange={handleSearch} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-borderless table-hover table-nowrap table-centered mb-0" data-page-size={7}>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th data-toggle="true">Image</th>
                                                        <th data-toggle="true">Code</th>
                                                        <th data-toggle="true">Name</th>
                                                        <th data-hide="phone">Price</th>
                                                        <th data-hide="phone, tablet">Rating</th>
                                                        <th data-hide="phone, tablet">Tags</th>
                                                        <th data-hide="phone, tablet">Category</th>
                                                        <th data-hide="phone, tablet">Status</th>
                                                        <th data-hide="phone, tablet">Type</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentCourses.length > 0 && (
                                                            currentCourses.map((cus) => (

                                                                <tr>
                                                                    <td>
                                                                        <img src={cus.imageUrl} style={{ height: '70px', width: '100px' }}>

                                                                        </img>
                                                                    </td>
                                                                    <td>{cus.code}</td>
                                                                    <td>{cus.name}</td>
                                                                    <td>{cus.stockPrice}</td>
                                                                    <td>{cus.rating}</td>
                                                                    <td>{cus.tags}</td>
                                                                    <td>{cus.category.name}</td>
                                                                    <td>
                                                                        {cus.isActive ? (
                                                                            <span className="badge label-table badge-success">Active</span>
                                                                        ) : (
                                                                            <span className="badge label-table badge-danger">Inactive</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <span className={`badge ${cus.isOnlineClass ? 'badge-success' : 'badge-danger'}`}>{cus.isOnlineClass ? 'Class' : 'Video'}</span>
                                                                    </td>
                                                                    <td>
                                                                        <Link to={`/edit-course/${cus.id}`} className='text-secondary'>
                                                                            <i class="fa-regular fa-eye"></i>
                                                                        </Link>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )
                                                    }

                                                </tbody>

                                            </table>
                                        </div> {/* end .table-responsive*/}
                                    </div> {/* end card-box */}
                                    {
                                        currentCourses.length === 0 && (
                                            <p>There are no Courses.</p>
                                        )
                                    }
                                </div> {/* end col */}
                            </div>
                            {/* end row */}
                            {/* Pagination */}
                            <div className='container-fluid'>
                                {/* Pagination */}
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <ReactPaginate
                                        previousLabel={
                                            <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                                <AiFillCaretLeft />
                                            </IconContext.Provider>
                                        }
                                        nextLabel={
                                            <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                                <AiFillCaretRight />
                                            </IconContext.Provider>
                                        } breakLabel={'...'}
                                        breakClassName={'page-item'}
                                        breakLinkClassName={'page-link'}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={handlePageClick}
                                        containerClassName={'pagination'}
                                        activeClassName={'active'}
                                        previousClassName={'page-item'}
                                        nextClassName={'page-item'}
                                        pageClassName={'page-item'}
                                        previousLinkClassName={'page-link'}
                                        nextLinkClassName={'page-link'}
                                        pageLinkClassName={'page-link'}
                                    />
                                </div>

                            </div>


                        </div> {/* container */}
                    </div> {/* content */}
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}


            </div>
            <style>
                {`
                .page-item.active .page-link{
                    background-color: #20c997;
                    border-color: #20c997;
                }
            `}
            </style>
        </>
    )
}

export default ListCourseInActive