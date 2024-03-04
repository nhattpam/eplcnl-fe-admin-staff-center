import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import refundRequestService from '../../services/refund-request.service';
import transactionService from '../../services/transaction.service';
import courseService from '../../services/course.service';
import walletService from '../../services/wallet.service';
import enrollmentService from '../../services/enrollment.service';
import learnerService from '../../services/learner.service';

const EditRefundRequest = () => {

    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [isDoneOrNot, setIsDoneOrNot] = useState(false);

    const { refundId } = useParams();

    const [refund, setRefund] = useState({
        id: "",
        transactionId: "",
        requestedDate: "",
        approvedDate: "",
        status: "",
        reason: "",
    });

    const [transaction, setTransaction] = useState({
        courseId: "",
        amount: ""
    });

    const [course, setCourse] = useState({
        name: "",
        description: "",
        code: "",
        imageUrl: "",
        stockPrice: "",
        rating: "",
        category: "",
        tags: "",
        createdDate: "",
        updatedDate: "",
    });


    useEffect(() => {
        if (refundId) {
            refundRequestService
                .getRefundRequestById(refundId)
                .then((res) => {
                    setRefund(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [refundId]);

    useEffect(() => {
        if (refund.transactionId) {
            transactionService
                .getTransactionById(refund.transactionId)
                .then((res) => {
                    setTransaction(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [refund.transactionId]);



    useEffect(() => {
        if (transaction.courseId) {
            courseService
                .getCourseById(transaction.courseId)
                .then((res) => {
                    setCourse(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [transaction.courseId]);


    //approve refund request
    const handleApproveRefund = () => {

        //tru tien admin
        walletService.getWalletById("188e9df9-be4b-4531-858e-098ff8c3735c") //admin's wallet
            .then((response) => {
                const updatedWallet = {
                    balance: response.data.balance - transaction.amount,
                    accountId: "9b868733-8ab1-4191-92ab-65d1b82863c3"
                }

                //update admin wallet balance
                walletService.updateWallet(response.data.id, updatedWallet);
            })

        //xoa enrollment chua learnerId va courseId thuoc ve transactionId
        enrollmentService.deleteEnrollmentByLearnerIdAndCourseId(transaction.learnerId, transaction.courseId);

        //update transaction refundStatus = true
        transaction.refundStatus = true;
        transactionService.updateTransaction(transaction.id, transaction);

        //update refund status = APPROVE
        refund.status = "APPROVED";
        refundRequestService.updateRefundRequest(refundId, refund);
        //update learner wallet balance
        learnerService.getLearnerById(transaction.learnerId)
            .then((response) => {
                const updatedWallet = {
                    balance: response.data.account.wallet.balance + transaction.amount,
                    accountId: response.data.accountId
                }

                //update admin wallet balance
                walletService.updateWallet(response.data.account.wallet.id, updatedWallet);
            })


        navigate(`/list-refund`);
    };
  


    const handleDisApproveRefund = () => {
        //update refund status = DISAPPROVED
        refund.status = "DISAPPROVED";
        refundRequestService.updateRefundRequest(refundId, refund);
        navigate(`/list-refund`);
    }

    //check if refund has status -> disable 2 buttons
    useEffect(() => {
        if (refund.status === "APPROVED" || refund.status == "DISAPPROVED") {
            setIsDoneOrNot(true);
        }
    })

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
                                    <h4 className="header-title">TRANSACTION INFORMATION</h4>

                                    <form id="demo-form" data-parsley-validate>
                                        <div className="form-group">
                                            <label htmlFor="transactionId">Transaction Id:</label>
                                            <div>
                                                <span>{refund.transactionId}</span>
                                            </div>
                                            <label htmlFor="transactionId" className='mt-1'>Amount:</label>
                                            <div>
                                                <span>{transaction.amount} Vnd</span>
                                            </div>
                                        </div>
                                        <label htmlFor="transactionId">Course Information:</label>

                                        <div className="table-responsive">
                                            <table id="demo-foo-filtering" className="table table-bordered toggle-circle mb-0" data-page-size={7}>
                                                <thead>
                                                    <tr>
                                                        <th data-toggle="true">Image</th>
                                                        <th data-toggle="true">Code</th>
                                                        <th data-toggle="true">Name</th>
                                                        <th data-hide="phone">Price</th>
                                                        <th data-hide="phone, tablet">Rating</th>
                                                        <th data-hide="phone, tablet">Tags</th>
                                                        <th data-hide="phone, tablet">Category</th>
                                                        <th data-hide="phone, tablet">Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    <tr>
                                                        <td>
                                                            <img src={course.imageUrl} style={{ height: '70px', width: '100px' }}>

                                                            </img>
                                                        </td>
                                                        <td>{course.code}</td>
                                                        <td>{course.name}</td>
                                                        <td>{course.stockPrice}</td>
                                                        <td>{course.rating}</td>
                                                        <td>{course.tags}</td>
                                                        <td>{course.category.name}</td>
                                                        <td>
                                                            {course.isActive ? (
                                                                <span className="badge label-table badge-success">Active</span>
                                                            ) : (
                                                                <span className="badge label-table badge-danger">Inactive</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <Link to={`/edit-course/${course.id}`} className='text-secondary'>
                                                                <i class="fa-regular fa-eye"></i>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                </tbody>

                                            </table>
                                        </div> {/* end .table-responsive*/}
                                        {
                                            !isDoneOrNot && (
                                                <div className="form-group mb-0" style={{ marginTop: '15px' }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-success" onClick={() => handleApproveRefund()}
                                                    >
                                                        <i class="fa-solid fa-thumbs-up"></i> Approve
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger ml-1" onClick={() => handleDisApproveRefund()}
                                                    >
                                                        <i class="fa-solid fa-thumbs-down"></i> Disapprove
                                                    </button>
                                                </div>
                                            )
                                        }

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

export default EditRefundRequest;
