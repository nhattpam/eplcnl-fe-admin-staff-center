import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { useNavigate, useParams } from 'react-router-dom';
import accountService from '../../services/account.service';

const EditStaff = () => {

  const [account, setAccount] = useState({
    id: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    imageUrl: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    isActive: "",
    createdDate: "",
  });


  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();






  const { id } = useParams();

  useEffect(() => {
    if (id) {
      accountService
        .getAccountById(id)
        .then((res) => {
          setAccount(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);




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
                  <h4 className="header-title">STAFF INFORMATION</h4>

                  <form id="demo-form" data-parsley-validate>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th>Staff Name:</th>
                            <td>{account.fullName}</td>
                          </tr>
                          <tr>
                            <th>Email:</th>
                            <td>{account.email}</td>
                          </tr>
                          <tr>
                            <th>Phone Number:</th>
                            <td>{account.phoneNumber}</td>
                          </tr>
                          <tr>
                            <th>Date Of Birth:</th>
                            <td>{account.dateOfBirth}</td>
                          </tr>
                          <tr>
                            <th>Gender:</th>
                            <td>
                              {account.gender ? (
                                <span className="badge label-table badge-success">Male</span>
                              ) : (
                                <span className="badge label-table badge-danger">Female</span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>



                    <div className="form-group mb-0">
                      <button
                        type="submit"
                        className="btn btn-danger"
                      >
                        <i class="fa-solid fa-user-xmark"></i> Delete
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
                        width: 85%;
                        text-align: left;
                    }
                `}
      </style>
    </>
  )
}

export default EditStaff;
