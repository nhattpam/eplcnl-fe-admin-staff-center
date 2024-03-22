import React, { useEffect, useState } from 'react';
import Header from '../Header'
import Footer from '../Footer'
import Sidebar from '../Sidebar'
import centerService from '../../services/center.service'
import { Link, useNavigate } from 'react-router-dom';
import accountService from '../../services/account.service';
import walletService from '../../services/wallet.service';

const CenterDashboard = () => {

    const centerId = localStorage.getItem('centerId');

    const [tutorList, setTutorList] = useState([]);
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [tutorsPerPage] = useState(5);
    const [currentPage2, setCurrentPage2] = useState(0);
    const [historiesPerPage] = useState(5);

    const storedAccountId = localStorage.getItem('accountId');

    const [tutorCount, setTutorCount] = useState(0);

    const [account, setAccount] = useState({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        imageUrl: "",
        gender: "",
        wallet: []
    });

    useEffect(() => {
        if (storedAccountId) {
            accountService
                .getAccountById(storedAccountId)
                .then((res) => {
                    setAccount(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [storedAccountId]);

    useEffect(() => {
        centerService
            .getAllTutorsByCenter(centerId)
            .then((res) => {
                console.log(res.data);
                setTutorList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, [centerId]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };


    const filteredTutors = tutorList
        .filter((tutor) => {
            return (
                tutor.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredTutors.length / tutorsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * tutorsPerPage;
    const currentTutors = filteredTutors.slice(offset, offset + tutorsPerPage);

    // Function to count the centers
    async function countTutors() {
        try {
            const response = await centerService.getAllTutorsByCenter(centerId)
            const tutors = response.data;
            const tutorCount = tutors.length;


            setTutorCount(tutorCount);
        } catch (error) {
            console.error("Error counting tutors:", error);
        }
    }

    useEffect(() => {
        countTutors();
    }, []);

    //WALLET HISTORY
    const [walletHistoryList, setWalletHistoryList] = useState([]);

    useEffect(() => {
        walletService
            .getAllWalletHistoryByWallet(account?.wallet?.id)
            .then((res) => {
                setWalletHistoryList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [account.wallet?.id]);


    const filteredHistories = walletHistoryList
        .filter((history) => {
            return (
                history.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount2 = Math.ceil(filteredHistories.length / historiesPerPage);

    const handlePageClick2 = (data) => {
        setCurrentPage2(data.selected);
    };
    const offset2 = currentPage2 * historiesPerPage;
    const currentHistories = filteredHistories.slice(offset2, offset2 + historiesPerPage);

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

                                        <h4 className="page-title">Dashboard</h4>
                                    </div>
                                </div>
                            </div>
                            {/* end page title */}
                            <div className="row">
                                <div className="col-md-6 col-xl-3">
                                    <div className="widget-rounded-circle card-box">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="avatar-lg rounded-circle bg-soft-primary border-primary border">
                                                    <i className="fe-users font-22 avatar-title text-primary" />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-right">
                                                    <h3 className="mt-1"><span data-plugin="counterup">{tutorCount}</span></h3>
                                                    <p className="text-muted mb-1 text-truncate">Total Tutor</p>
                                                </div>
                                            </div>
                                        </div> {/* end row*/}
                                    </div> {/* end widget-rounded-circle*/}
                                </div> {/* end col*/}
                            </div>
                            {/* end row*/}

                            {/* end row */}
                            <div className="row">
                                <div className="col-xl-6">
                                    <div className="card-box">

                                        <h4 className="header-title mb-3">Top 5 Tutors</h4>
                                        <div className="table-responsive">
                                            <table className="table table-borderless table-hover table-nowrap table-centered m-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th colSpan={2}>Profile</th>
                                                        <th>Phone</th>
                                                        <th>Gender</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentTutors.length > 0 && currentTutors.map((tutor, index) => (
                                                            <tr>
                                                                <td style={{ width: 36 }}>
                                                                    <img src={tutor.account?.imageUrl} alt="contact-img" title="contact-img" className="rounded-circle avatar-sm" />
                                                                </td>
                                                                <td>
                                                                    <h5 className="m-0 font-weight-normal">{tutor.account && tutor.account?.fullName ? tutor.account?.fullName : 'Unknown Name'}</h5>
                                                                    <p className="mb-0 text-muted"><small>Member Since {tutor.account?.createdDate ? tutor.account.createdDate.substring(0, 4) : ""}</small></p>
                                                                </td>
                                                                <td>
                                                                    {tutor.account && tutor.account?.phoneNumber ? tutor.account?.phoneNumber : 'Unknown Phone Number'}
                                                                </td>
                                                                <td>
                                                                    {tutor.account && tutor.account?.gender !== undefined ? (tutor.account?.gender ? 'Male' : 'Female') : 'Unknown Gender'}
                                                                </td>

                                                                <td>
                                                                    <Link to={`/edit-tutor/${tutor.account.id}`} className='text-secondary'>
                                                                        <i className="fa-regular fa-eye"></i>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div> {/* end col */}
                                <div className="col-xl-6">
                                    <div className="card-box">
                                        <h4 className="header-title mb-3">Revenue History</h4>
                                        <div className="table-responsive">
                                            <table className="table table-borderless table-wrap table-hover table-centered m-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>Transaction Date</th>
                                                        <th>Note</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentHistories.length > 0 && currentHistories.map((history, index) => (
                                                            <tr>
                                                                <td>
                                                                    <h5 className="m-0 font-weight-normal">{history.transactionDate}</h5>
                                                                </td>
                                                                <td>
                                                                    {history.note}
                                                                </td>

                                                            </tr>
                                                        )
                                                        )
                                                    }

                                                </tbody>
                                            </table>
                                        </div> {/* end .table-responsive*/}
                                    </div> {/* end card-box*/}
                                </div> {/* end col */}
                            </div>
                            {/* end row */}
                        </div> {/* container */}
                    </div> {/* content */}
                    {/* Footer Start */}

                    {/* end Footer */}
                </div>
                {/* ============================================================== */}
                {/* End Page content */}
                {/* ============================================================== */}

            </div>

        </>
    )
}

export default CenterDashboard