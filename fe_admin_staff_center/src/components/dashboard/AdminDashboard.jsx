import { React, useState, useEffect, useRef } from "react";
import Header from '../Header'
import Footer from '../Footer'
import Sidebar from '../Sidebar'
import { Chart, PieController, ArcElement, registerables } from "chart.js";
import transactionService from "../../services/transaction.service";
import enrollmentService from "../../services/enrollment.service";
import accountService from "../../services/account.service";
import { useNavigate } from "react-router-dom";
import courseService from "../../services/course.service";
import centerService from "../../services/center.service";

const AdminDashboard = () => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
    console.log("STatus: " + storedLoginStatus)
    const navigate = useNavigate();
    if (!storedLoginStatus) {
        navigate(`/login`)
    }
    Chart.register(PieController, ArcElement);
    Chart.register(...registerables);
    const pieChartRef = useRef(null);
    const areaChartRef = useRef(null);

    const [transactionCount, setTransactionCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    // const [appointmentCount, setAppointmentCount] = useState(0);
    const [sumForCurrentMonth, setSumForCurrentMonth] = useState(0);
    const [sumForPreviousMonth, setSumForPreviousMonth] = useState(0);
    const [sumForCurrentYear, setSumForCurrentYear] = useState(0);
    const [sumForToday, setSumForToday] = useState(0);
    //area chart
    const [monthlyData, setMonthlyData] = useState([]);
    //list transaction
    const [transactionList, setTransactionList] = useState([]);
    const [enrollmentList, setEnrollmentList] = useState([]);
    const [transactionsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);


    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

    useEffect(() => {
        countTransactions();
        // countAppointments();
        fetchMonthlyData();
        fetchTransactions();
        fetchEnrollmentsAndCalculateSum4();
        countUser();
    }, []);

    useEffect(() => {
        if (sumForCurrentMonth !== 0 && sumForPreviousMonth !== 0) {
            createPieChart();
        }
    }, [sumForCurrentMonth, sumForPreviousMonth]);

    useEffect(() => {
        if (monthlyData.length > 0) {
            createAreaChart();
        }
    }, [monthlyData]);

    //list transaction
    const fetchTransactions = async () => {
        try {
            const res = await transactionService.getAllTransaction();
            const transactions = res.data;

            // Sort transactions by transactionDate
            transactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));

            setTransactionList(transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }


    //paginate list transaction
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTransactions = transactionList
        .filter((transaction) => {
            return (
                transaction.id.toString().toLowerCase().includes(searchTerm.toLowerCase())

            );
        });

    const pageCount = Math.ceil(filteredTransactions.length / transactionsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const offset = currentPage * transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(offset, offset + transactionsPerPage);

    //Income by month
    const fetchEnrollmentsAndCalculateSum = async () => {
        try {
            const res = await enrollmentService.getAllEnrollment();
            const activeEnrollments = res.data.filter((enrollment) => enrollment.refundStatus === false);

            const enrollments = activeEnrollments;

            const sumForCurrentMonth = calculateSumByMonth(enrollments);
            setSumForCurrentMonth(sumForCurrentMonth);
            console.log("Sum for current month:", sumForCurrentMonth);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
        }
    };

    fetchEnrollmentsAndCalculateSum();

    const calculateSumByMonth = (enrollments) => {
        // Get the current month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();

        // Initialize the sum for the current month
        let sumForCurrentMonth = 0;

        // Iterate over each transaction
        enrollments.forEach((enrollment) => {
            // Extract the month from the transaction date
            const enrollmentDate = new Date(enrollment.enrolledDate);
            const enrollmentMonth = enrollmentDate.getMonth() + 1; // Add 1 to match the format of transaction month

            // Check if the transaction belongs to the current month
            if (enrollmentMonth === currentMonth + 1) { // Add 1 to match the format of current month
                sumForCurrentMonth += (enrollment.transaction?.amount / 24000) * 0.2; // Use the correct property name
            }
        });

        return sumForCurrentMonth;
    };

    //Income by year
    const fetchEnrollmentsAndCalculateSum1 = async () => {
        try {
            const res = await enrollmentService.getAllEnrollment();
            const activeEnrollments = res.data.filter((enrollment) => enrollment.refundStatus === false);

            const enrollments = activeEnrollments;


            const sumForCurrentYear = calculateSumByYear(enrollments);
            setSumForCurrentYear(sumForCurrentYear);
            console.log("Sum for current year:", sumForCurrentYear);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
        }
    };

    fetchEnrollmentsAndCalculateSum1();


    const calculateSumByToday = (enrollments) => {
        // Get the current date
        const currentDate = new Date();
        const currentDay = currentDate.getDate();

        // Initialize sum for today
        let sumForToday = 0;

        // Iterate over each transaction
        enrollments.forEach((enrollment) => {
            // Extract the day from the transaction date
            const transactionDay = new Date(enrollment.enrolledDate).getDate();

            // Check if the transaction occurred today
            if (transactionDay === currentDay) {
                sumForToday += (enrollment.transaction?.amount / 24000) * 0.2; // Assuming transaction.amount is the amount of the transaction
            }
        });

        return sumForToday;
    };

    const calculateSumByYear = (enrollments) => {
        // Get the current year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Initialize the sum for the current year
        let sumForCurrentYear = 0;

        // Iterate over each transaction
        enrollments.forEach((enrollment) => {
            // Extract the year from the transaction date
            const transactionYear = new Date(enrollment.enrolledDate).getFullYear();

            // Check if the transaction belongs to the current year
            if (transactionYear === currentYear) {
                sumForCurrentYear += enrollment.transaction?.amount;
            }
        });

        return sumForCurrentYear;
    };

    const calculateSumByPreviousMonth = (enrollments) => {
        // Get the current date
        const currentDate = new Date();

        // Calculate the previous month
        let previousMonth = currentDate.getMonth() - 1;

        // Adjust the month if the previous month was in the previous year
        if (previousMonth < 0) {
            previousMonth = 11;
        }

        // Initialize the sum for the previous month
        let sumForPreviousMonth = 0;

        // Iterate over each transaction
        enrollments.forEach((enrollment) => {
            // Extract the month from the transaction date
            const transactionMonth = new Date(enrollment.enrolledDate).getMonth();

            // Check if the transaction belongs to the previous month
            if (transactionMonth === previousMonth) {
                sumForPreviousMonth += (enrollment.transaction?.amount / 24000) * 0.2;
            }
        });

        return sumForPreviousMonth;
    };

    const fetchEnrollmentsAndCalculateSum3 = async () => {
        try {
            const res = await enrollmentService.getAllEnrollment();
            const activeEnrollments = res.data.filter((enrollment) => enrollment.refundStatus === false);

            const enrollments = activeEnrollments;

            const sumForPreviousMonth = calculateSumByPreviousMonth(enrollments);
            setSumForPreviousMonth(sumForPreviousMonth);
            console.log("Sum for previous month:", sumForPreviousMonth);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
        }
    };

    fetchEnrollmentsAndCalculateSum3();

    const fetchEnrollmentsAndCalculateSum4 = async () => {
        try {
            const res = await enrollmentService.getAllEnrollment();
            const activeEnrollments = res.data.filter((enrollment) => enrollment.refundStatus === false);

            const enrollments = activeEnrollments;


            const sumForToday = calculateSumByToday(enrollments);
            setSumForToday(sumForToday);
            console.log("Sum for today:", sumForToday);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
        }
    };

    fetchEnrollmentsAndCalculateSum4();

    const createPieChart = () => {
        const pieChartCanvas = pieChartRef.current.getContext("2d");

        if (pieChartRef.current.chart) {
            pieChartRef.current.chart.destroy();
        }

        const data = {
            labels: ["Previous Month", "Current Month"],
            datasets: [
                {
                    data: [sumForPreviousMonth, sumForCurrentMonth],
                    backgroundColor: ["#088F8F", "#7CFC00"],
                    hoverBackgroundColor: ["#0047AB", "#008000"],
                },
            ],
        };

        const options = {
            plugins: {
                legend: {
                    display: true,
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: (context) => {
                            const label = context.label;
                            const value = context.formattedValue;
                            return `${label}: $${value}`;
                        },
                    },
                },
            },
        };

        pieChartRef.current.chart = new Chart(pieChartCanvas, {
            type: "pie",
            data: data,
            options: options,
        });
    };


    //area chart
    const fetchMonthlyData = async () => {
        try {
            const res = await enrollmentService.getAllEnrollment();
            const activeEnrollments = res.data.filter((enrollment) => enrollment.refundStatus === false);

            const enrollments = activeEnrollments;

            const currentYear = new Date().getFullYear();

            // Initialize an array to store monthly data
            const monthlyData = Array(12).fill(0);

            // Iterate over each transaction
            enrollments.forEach((enrollment) => {
                const transactionDate = new Date(enrollment.enrolledDate);
                const transactionYear = transactionDate.getFullYear();
                const transactionMonth = transactionDate.getMonth();

                // Check if the transaction belongs to the current year
                if (transactionYear === currentYear) {
                    // Add the transaction's total price to the corresponding month's data
                    monthlyData[transactionMonth] += (enrollment.transaction?.amount / 24000) * 0.2;
                }
            });

            setMonthlyData(monthlyData);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
        }
    };

    const createAreaChart = () => {
        const areaChartCanvas = areaChartRef.current.getContext("2d");

        if (areaChartRef.current.chart) {
            areaChartRef.current.chart.destroy();
        }

        const data = {
            labels: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ],
            datasets: [
                {
                    label: "Income",
                    data: monthlyData,
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    btransactionColor: "rgba(54, 162, 235, 1)",
                    btransactionWidth: 2,
                    pointBackgroundColor: "rgba(54, 162, 235, 1)",
                    pointBtransactionColor: "#fff",
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        };

        const options = {
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        btransactionDash: [2],
                        btransactionDashOffset: [2],
                        drawBtransaction: false,
                        color: "rgba(0, 0, 0, 0.05)",
                        zeroLineColor: "rgba(0, 0, 0, 0.1)",
                    },
                    ticks: {
                        callback: (value) => {
                            if (value >= 1000) {
                                return `$${value / 1000}k`;
                            }
                            return `$${value}`;
                        },
                    },
                },
            },
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: (context) => {
                            const label = context.dataset.label;
                            const value = context.formattedValue;
                            return `${label}: $${value}`;
                        },
                    },
                },
            },
        };

        areaChartRef.current.chart = new Chart(areaChartCanvas, {
            type: "line",
            data: data,
            options: options,
        });
    };


    // Create an instance of the TransactionService class
    // Function to count the transactions
    async function countTransactions() {
        try {
            const res = await transactionService.getAllTransaction();
            const transactions = res.data;
            const transactionCount = transactions.length;


            setTransactionCount(transactionCount);
        } catch (error) {
            console.error("Error counting transactions:", error);
        }
    }
    //count all user 
    async function countUser() {
        try {
            const res = await accountService.getAllAccount();

            const users = res.data;
            const userCount = users.length;


            setUserCount(userCount);
        } catch (error) {
            console.error("Error counting users:", error);
        }
    }


    const [currentMonthVsPreviousMonth, setCurrentMonthVsPreviousMonth] = useState(0);
    //loi lo
    useEffect(() => {
        setCurrentMonthVsPreviousMonth(sumForCurrentMonth - sumForPreviousMonth);
    }, [sumForCurrentMonth, sumForPreviousMonth]);



    //DETAIL MONEY TRANSACTION
    const [center, setCenter] = useState({
        id: "",
        name: ""
    });

    const [course, setCourse] = useState({
        id: "",
        tutor: []
    });
    const [expandedDetail, setExpandedDetail] = useState({});


    const closeTransactionDetailModal = () => {
        setExpandedDetail(false);
    };

    const toggleDetail = (id) => {
        transactionService.getTransactionById(id)
            .then((transactionRes) => {
                courseService.getCourseById(transactionRes.data.courseId)
                    .then((courseRes) => {
                        setCourse(courseRes.data);
                        if (!courseRes.data.tutor?.isFreelancer) {
                            centerService.getCenterById(courseRes.data.tutor?.centerId)
                                .then((centerRes) => {
                                    setCenter(centerRes.data);
                                })
                        }

                        setExpandedDetail(prevState => ({
                            ...prevState,
                            [id]: !prevState[id]
                        }));
                    });
            });
    };


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
                                                <div className="avatar-lg rounded-circle bg-soft-primary btransaction-primary btransaction">
                                                    <i className="fe-heart font-22 avatar-title text-primary" />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-right">
                                                    <h3 className="mt-1">$<span data-plugin="counterup">{sumForCurrentMonth.toFixed(2)}</span></h3>
                                                    <p className="text-muted mb-1 text-truncate">Earnings (Monthly)</p>
                                                </div>
                                            </div>
                                        </div> {/* end row*/}
                                    </div> {/* end widget-rounded-circle*/}
                                </div> {/* end col*/}
                                <div className="col-md-6 col-xl-3">
                                    <div className="widget-rounded-circle card-box">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="avatar-lg rounded-circle bg-soft-success btransaction-success btransaction">
                                                    <i className="fe-shopping-cart font-22 avatar-title text-success" />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-right">
                                                    <h3 className="text-dark mt-1">$<span data-plugin="counterup">{(sumForCurrentYear / 24000).toFixed(2)}</span></h3>
                                                    <p className="text-muted mb-1 text-truncate">Earnings (Annual)</p>
                                                </div>
                                            </div>
                                        </div> {/* end row*/}
                                    </div> {/* end widget-rounded-circle*/}
                                </div> {/* end col*/}
                                <div className="col-md-6 col-xl-3">
                                    <div className="widget-rounded-circle card-box">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="avatar-lg rounded-circle bg-soft-info btransaction-info btransaction">
                                                    <i className="fe-bar-chart-line- font-22 avatar-title text-info" />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-right">
                                                    <h3 className="text-dark mt-1"><span data-plugin="counterup">{transactionCount}</span></h3>
                                                    <p className="text-muted mb-1 text-truncate">Transactions</p>
                                                </div>
                                            </div>
                                        </div> {/* end row*/}
                                    </div> {/* end widget-rounded-circle*/}
                                </div> {/* end col*/}
                                <div className="col-md-6 col-xl-3">
                                    <div className="widget-rounded-circle card-box">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="avatar-lg rounded-circle bg-soft-warning btransaction-warning btransaction">
                                                    <i className="fe-users font-22 avatar-title text-info" />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-right">
                                                    <h3 className="text-dark mt-1"><span data-plugin="counterup">{userCount}</span></h3>
                                                    <p className="text-muted mb-1 text-truncate">Total Users</p>
                                                </div>
                                            </div>
                                        </div> {/* end row*/}
                                    </div> {/* end widget-rounded-circle*/}
                                </div> {/* end col*/}

                            </div>
                            {/* end row*/}
                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="card-box">
                                        <div className="dropdown float-right">

                                        </div>
                                        <h4 className="header-title mb-0">Total Revenue</h4>
                                        <div className="widget-chart text-center" dir="ltr">
                                            <div id="total-revenue" className="mt-0" data-colors="#f1556c" />
                                            <h5 className="text-muted mt-0">Total sales made today</h5>
                                            <h2>${sumForToday}</h2>
                                            <div class="row mt-3">
                                                {/* <div class="col-4">
                                                    <p class="text-muted font-15 mb-1 text-truncate">Target</p>
                                                    <h4><i class="fe-arrow-down text-danger mr-1"></i>$7.8k</h4>
                                                </div>
                                                <div class="col-4">
                                                    <p class="text-muted font-15 mb-1 text-truncate">Last week</p>
                                                    <h4><i class="fe-arrow-up text-success mr-1"></i>$1.4k</h4>
                                                </div> */}
                                                <div class="col-12">
                                                    <p class="text-muted font-15 mb-1 text-truncate">Last Month</p>
                                                    {
                                                        currentMonthVsPreviousMonth > 0 && (
                                                            <h4><i class="fe-arrow-up text-success mr-1"></i>${currentMonthVsPreviousMonth}</h4>

                                                        )
                                                    }
                                                    {
                                                        currentMonthVsPreviousMonth < 0 && (
                                                            <h4><i class="fe-arrow-down text-danger mr-1"></i>${currentMonthVsPreviousMonth}</h4>

                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div> {/* end card-box */}
                                </div> {/* end col*/}
                                <div className="col-lg-8">
                                    <div className="card-box pb-2">
                                        <div className="float-right d-none d-md-inline-block">

                                        </div>
                                        <h4 className="header-title mb-3">Sales Analytics</h4>
                                        <div dir="ltr">
                                            <div className="card-body">
                                                <div className="chart-area">
                                                    <canvas ref={areaChartRef} id="myAreaChart" />
                                                </div>
                                            </div>
                                        </div>
                                    </div> {/* end card-box */}
                                </div> {/* end col*/}
                            </div>
                            {/* end row */}
                            <div className="row">
                                <div className="col-xl-5">
                                    <div className="card-box">
                                        <div className="dropdown float-right">

                                        </div>
                                        <h4 className="header-title mb-3">Income Comparison</h4>
                                        <div class="card shadow mb-4">

                                            <div class="card-body">
                                                <div className="chart-pie pt-4 pb-2">
                                                    <canvas ref={pieChartRef} id="myPieChart3"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> {/* end col */}
                                <div className="col-xl-6">
                                    <div className="card-box">
                                        <div className="dropdown float-right">

                                        </div>
                                        <h4 className="header-title mb-3">Revenue History</h4>
                                        <div className="table-responsive">
                                            <table className="table table-btransactionless table-nowrap table-hover table-centered m-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>Learner</th>
                                                        <th>Date</th>
                                                        <th>Payouts</th>
                                                        <th>Status</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentTransactions.length > 0 && currentTransactions.map((cus) => (
                                                            <>
                                                                <tr>
                                                                    <td>
                                                                        <h5 className="m-0 font-weight-normal">{cus.learner.account.fullName}</h5>
                                                                    </td>
                                                                    <td>{new Date(cus.transactionDate).toLocaleString('en-US')}</td>
                                                                    <td>
                                                                        ${cus.amount / 24000}
                                                                    </td>

                                                                    {
                                                                        cus.status === "DONE" && (
                                                                            <td>
                                                                                <span className="badge bg-soft-warning text-warning">DONE</span>

                                                                            </td>
                                                                        )
                                                                    }
                                                                    {
                                                                        cus.status === "PROCESSING" && (
                                                                            <td>
                                                                                <span className="badge bg-soft-warning text-warning">FAILED</span>

                                                                            </td>
                                                                        )
                                                                    }
                                                                    {
                                                                        cus.course !== null && cus.status === "DONE" && (
                                                                            <td>
                                                                                <i className="fa-regular fa-eye" style={{ cursor: 'pointer' }} onClick={() => toggleDetail(cus.id)}></i>
                                                                            </td>
                                                                        )
                                                                    }
                                                                </tr>
                                                                {expandedDetail[cus.id] && (
                                                                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                                                                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                                                                            <div className="modal-content">
                                                                                <div className="modal-header">
                                                                                    <h5 className="modal-title">Transaction Detail</h5>
                                                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeTransactionDetailModal}>
                                                                                        <span aria-hidden="true">&times;</span>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                                                                    <h4>Amount: <span className='text-danger'>${cus.amount / 24000}</span></h4>
                                                                                    {course.tutor?.isFreelancer && (
                                                                                        <>
                                                                                            <h4>Meowlish receives <span class='text-danger'>20%</span> of <span class='text-danger'>${cus.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.amount / 24000) * 0.2}</span></h4>
                                                                                            <h4>Tutor {course.tutor?.account?.fullName} receives <span class='text-danger'>80%</span> of <span class='text-danger'>${cus.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.amount / 24000) * 0.8}</span></h4>

                                                                                        </>
                                                                                    )}
                                                                                    {!course.tutor?.isFreelancer && (
                                                                                        <>
                                                                                            <h4>Meowlish receives <span class='text-danger'>20%</span> of <span class='text-danger'>${cus.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.amount / 24000) * 0.2}</span></h4>
                                                                                            <h4>Center {center.name} receives <span class='text-danger'>80%</span> of <span class='text-danger'>${cus.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.amount / 24000) * 0.8}</span></h4>

                                                                                        </>

                                                                                    )}
                                                                                </div>
                                                                                <div className="modal-footer">
                                                                                    <button type="button" className="btn btn-dark" style={{ borderRadius: '50px', padding: '8px 25px' }} onClick={closeTransactionDetailModal}>Close</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>

                                                        ))
                                                    }

                                                </tbody>
                                            </table>
                                            {
                                                currentTransactions.length === 0 && (
                                                    <p className="mt-3">No transactions found.</p>
                                                )
                                            }
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
            <style>
                {`
                                          .loading-overlay {
                                            position: fixed;
                                            top: 0;
                                            left: 0;
                                            width: 100%;
                                            height: 100%;
                                            backdrop-filter: blur(10px); /* Apply blur effect */
                                            -webkit-backdrop-filter: blur(10px); /* For Safari */
                                            background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                            z-index: 9999; /* Ensure it's on top of other content */
                                        }
                                        
                                        .loading-spinner {
                                            border: 8px solid rgba(245, 141, 4, 0.1); /* Transparent border to create the circle */
                                            border-top: 8px solid #f58d04; /* Orange color */
                                            border-radius: 50%;
                                            width: 50px;
                                            height: 50px;
                                            animation: spin 1s linear infinite; /* Rotate animation */
                                        }
                                        
                                        @keyframes spin {
                                            0% {
                                                transform: rotate(0deg);
                                            }
                                            100% {
                                                transform: rotate(360deg);
                                            }
                                        }
                                        
                                        
                                        `}
            </style>
        </>
    )
}

export default AdminDashboard