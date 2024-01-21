import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

const EditCenter = () => {
    return (
        <>
            <div id="wrapper">
                <Header />
                <Sidebar />
                <div className="content-page">
                    {/* Start Content*/}
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card-box">
                                    <h4 className="header-title">Center Information</h4>
                               
                                    <div className="alert alert-warning d-none fade show">
                                        <h4 className="mt-0 text-warning">Oh snap!</h4>
                                        <p className="mb-0">This form seems to be invalid :(</p>
                                    </div>
                                    <div className="alert alert-info d-none fade show">
                                        <h4 className="mt-0 text-info">Yay!</h4>
                                        <p className="mb-0">Everything seems to be ok :)</p>
                                    </div>
                                    <form id="demo-form" data-parsley-validate>
                                        <div className="form-group">
                                            <label htmlFor="fullname">Center Name * :</label>
                                            <input type="text" className="form-control" name="fullname" id="fullname" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email * :</label>
                                            <input type="email" id="email" className="form-control" name="email" data-parsley-trigger="change" required />
                                        </div>
                                        <div className="form-group">
                                            <label>Is Managed By *:</label>
                                            <div className="radio mb-1">
                                                <input type="radio" name="gender" id="genderM" defaultValue="Male" required />
                                                <label htmlFor="genderM">
                                                    Staff 1
                                                </label>
                                            </div>
                                            <div className="radio">
                                                <input type="radio" name="gender" id="genderF" defaultValue="Female" />
                                                <label htmlFor="genderF">
                                                    Staff 2
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div className="form-group mb-0">
                                            {/* Approve Button */}
                                            <button type="submit" className="btn btn-success mr-2">
                                                <i className="bi bi-check-lg"></i> Approve
                                            </button>
                                            {/* Disapprove Button */}
                                            <button type="button" className="btn btn-danger">
                                                <i className="bi bi-x-lg"></i> Disapprove
                                            </button>
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
                        width: 100%;
                        text-align: left;
                    }
                `}
            </style>
        </>
    )
}

export default EditCenter;
