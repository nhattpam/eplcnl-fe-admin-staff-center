import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';
import refundRequestService from '../../services/refund-request.service';
import transactionService from '../../services/transaction.service';
import walletService from '../../services/wallet.service';
import enrollmentService from '../../services/enrollment.service';
import learnerService from '../../services/learner.service';
import walletHistoryService from '../../services/wallet-history.service';
import refundRequestHistoryService from '../../services/refund-request-history.service';

const EditRefundRequest = () => {

    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [isDoneOrNot, setIsDoneOrNot] = useState(false);

    const { refundId } = useParams();

    const [refund, setRefund] = useState({
        id: "",
        enrollmentId: "",
        requestedDate: "",
        approvedDate: "",
        status: "",
        reason: "",
        enrollment: []
    });

    const [enrollment, setEnrollment] = useState({
        transactionId: "",
        refundStatus: ""
    });



    useEffect(() => {
        if (refundId) {
            refundRequestService
                .getRefundRequestById(refundId)
                .then((res) => {
                    setRefund(res.data);
                    enrollmentService
                        .getEnrollmentById(res.data.enrollmentId)
                        .then((res) => {
                            setEnrollment(res.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [refundId]);

    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
      // Function to update currentDateTime every second
      const interval = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);
  
      // Clean-up function to clear the interval when the component unmounts
      return () => clearInterval(interval);
    }, []); 


    //approve refund request
    const handleApproveRefund = async () => {
        try {
            // Get admin's wallet
            const adminWalletResponse = await walletService.getWalletById("188e9df9-be4b-4531-858e-098ff8c3735c"); //admin's wallet
            const adminWallet = adminWalletResponse.data;

            // Calculate updated admin wallet balance
            const updatedAdminWallet = {
                balance: adminWallet.balance - (refund.enrollment.transaction.amount / 24000),
                accountId: "9b868733-8ab1-4191-92ab-65d1b82863c3",
            };

            // Update admin wallet balance
            await walletService.updateWallet(adminWallet.id, updatedAdminWallet);

            const walletHistory = {
                walletId: adminWallet.id,
                note: `-${refund.enrollment.transaction.amount / 24000}$ for returning learner ${refund.enrollment.transaction.learner.account.fullName} by refund request ${refund.id}  at ${currentDateTime.toLocaleString()}`,
            }

            await walletHistoryService.saveWalletHistory(walletHistory);

            // Update enrollment with refundStatus
            const updatedEnrollment = { ...enrollment, refundStatus: true };
            await enrollmentService.updateEnrollment(refund.enrollmentId, updatedEnrollment);

            // Set refund status to approved
            const updatedRefund = { ...refund, status: "APPROVED" };
            await refundRequestService.updateRefundRequest(refundId, updatedRefund);

            //create refund history
            const refundHistory = {
                refundRequestId: refundId,
                amount: refund.enrollment.transaction.amount / 24000,
                note: `MeowLish return ${refund.enrollment.transaction.amount / 24000}$ to learner ${refund.enrollment.transaction.learner.account.fullName} for course ${refund.enrollment.transaction.course.name} at ${currentDateTime.toLocaleString()}`,
            }

            await refundRequestHistoryService.saveRefundHistory(refundHistory);

            // Update learner wallet balance
            const learnerResponse = await learnerService.getLearnerById(refund.enrollment.transaction.learnerId);
            const learner = learnerResponse.data;
            const updatedLearnerWallet = {
                balance: learner.account.wallet.balance + (refund.enrollment.transaction.amount / 24000),
                accountId: learner.accountId,
            };
            await walletService.updateWallet(learner.account.wallet.id, updatedLearnerWallet);

            const walletHistory2 = {
                walletId: learner.account.wallet.id,
                note: `+${refund.enrollment.transaction.amount / 24000}$ from MeowLish by refund request for course ${refund.enrollment.transaction.course.name} at ${currentDateTime.toLocaleString()}`,
            }

            await walletHistoryService.saveWalletHistory(walletHistory2);

            // Navigate to the list of refunds
            navigate(`/list-refund`);
        } catch (error) {
            console.error("Error while approving refund:", error);
        }
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
                                    <h4 className="header-title">REFUND INFORMATION</h4>

                                    <form id="demo-form" data-parsley-validate>
                                        <div className="form-group">
                                            <label htmlFor="transactionId">Enrollment Id:</label>
                                            <div>
                                                <span>{refund.enrollmentId}</span>
                                            </div>
                                            <label htmlFor="transactionId" className='mt-1'>Amount:</label>
                                            <div>
                                                <span>{refund.enrollment?.transaction?.amount / 24000} dollars</span>
                                            </div>
                                            <label htmlFor="transactionId" className='mt-1'>Requested Date:</label>
                                            <div>
                                                <span>{refund.requestedDate} </span>
                                            </div>
                                        </div>
                                        <label htmlFor="transactionId">Course Information:</label>

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
                                                        <th data-hide="phone, tablet">Status</th>
                                                        <th data-hide="phone, tablet"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            {refund.enrollment && refund.enrollment.transaction && refund.enrollment.transaction.course && (
                                                                <img src={refund.enrollment.transaction.course.imageUrl} style={{ height: '70px', width: '100px' }} alt="Course Image" />
                                                            )}
                                                        </td>
                                                        <td>{refund.enrollment && refund.enrollment.transaction && refund.enrollment.transaction.course && refund.enrollment.transaction.course.code}</td>
                                                        <td>{refund.enrollment && refund.enrollment.transaction && refund.enrollment.transaction.course && refund.enrollment.transaction.course.name}</td>
                                                        <td>{refund.enrollment && refund.enrollment.transaction && refund.enrollment.transaction.course && refund.enrollment.transaction.course.stockPrice}$</td>
                                                        <td>{refund.enrollment && refund.enrollment.transaction && refund.enrollment.transaction.course && refund.enrollment.transaction.course.rating}</td>
                                                        <td>{refund.enrollment && refund.enrollment.transaction && refund.enrollment.transaction.course && refund.enrollment.transaction.course.tags}</td>
                                                        <td>
                                                            {refund.enrollment && refund.enrollment.transaction && refund.enrollment.transaction.course && refund.enrollment.transaction.course.isActive ? (
                                                                <span className="badge label-table badge-success">Active</span>
                                                            ) : (
                                                                <span className="badge label-table badge-danger">Inactive</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {refund.enrollment && refund.enrollment.transaction && refund.enrollment.transaction.course && (
                                                                <Link to={`/edit-course/${refund.enrollment.transaction.course.id}`} className='text-secondary'>
                                                                    <i className="fa-regular fa-eye"></i>
                                                                </Link>
                                                            )}
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
                                                        Approve
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger ml-1" onClick={() => handleDisApproveRefund()}
                                                    >
                                                        Disapprove
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
