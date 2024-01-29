import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'

const EditTopic = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        image: '',
        price: '',
        fullname: '',
        tags: '',
        description: '',
    });

    const handleChange = (value) => {
        setFormData({
            ...formData,
            description: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Add your form submission logic here if needed
        navigate('/tutor/courses/create/create-video-course/create-lesson');
    };

    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar isAdmin={sessionStorage.getItem('isAdmin') === 'true'}
                    isStaff={sessionStorage.getItem('isStaff') === 'true'}
                    isCenter={sessionStorage.getItem('isCenter') === 'true'} />
                <div className="content-page">
                    <div className="content">
                        {/* Start Content*/}
                        <div className="container-fluid">
                            {/* start page title */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <form
                                                method="post"
                                                className="dropzone"
                                                id="myAwesomeDropzone"
                                                data-plugin="dropzone"
                                                data-previews-container="#file-previews"
                                                data-upload-preview-template="#uploadPreviewTemplate"
                                                data-parsley-validate
                                            >
                                                <div className="card">
                                                    <div className='card-body'>
                                                        <h4 className="header-title">Create a Class course: Course ABC | Module ABC</h4>
                                                        <div className="form-group">
                                                            <label htmlFor="roomLink">Material Link * :</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="material"
                                                                id="material"

                                                            />
                                                        </div>
                                                        <label htmlFor="video">Description * :</label>
                                                        <ReactQuill
                                                            value={formData.description}
                                                            onChange={handleChange}
                                                            style={{ height: '300px' }}
                                                        />


                                                    </div>

                                                </div>
                                                <div className="form-group mb-0 ">
                                                    <button type="submit" className="btn btn-primary" >
                                                        Continue
                                                    </button>
                                                </div>
                                            </form>
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
