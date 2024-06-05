import { React, useState, useEffect, useRef } from "react";
import Header from '../Header'
import Footer from '../Footer'
import Sidebar from '../Sidebar'
import { Chart, PieController, ArcElement, registerables } from "chart.js";
import transactionService from "../../services/transaction.service";
import enrollmentService from "../../services/enrollment.service";
import accountService from "../../services/account.service";
import { Link, useNavigate } from "react-router-dom";
import courseService from "../../services/course.service";
import centerService from "../../services/center.service";
import ReactPaginate from "react-paginate";
import { IconContext } from "react-icons";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import tutorService from "../../services/tutor.service";
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
    const storedLoginStatus = sessionStorage.getItem('isLoggedIn');
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
        fetchTransactions2();
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

            const sumForCurrentMonth = calculateSumByMonth(transactionList2);
            setSumForCurrentMonth(sumForCurrentMonth);
            // console.log("Sum for current month:", sumForCurrentMonth);
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


            const sumForCurrentYear = calculateSumByYear(transactionList2);
            setSumForCurrentYear(sumForCurrentYear);
            // console.log("Sum for current year:", sumForCurrentYear);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
        }
    };

    fetchEnrollmentsAndCalculateSum1();


    const calculateSumByToday = (enrollments) => {
        // Get the current date
        const currentDate = new Date();
    
        // Initialize sum for today
        let sumForToday = 0;
    
        // Iterate over each transaction
        enrollments.forEach((enrollment) => {
            // Extract the date from the transaction date
            const transactionDate = new Date(enrollment.enrolledDate);
    
            // Check if the transaction occurred today
            if (transactionDate.toDateString() === currentDate.toDateString()) {
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
            const transactionYear = new Date(enrollment.transaction?.transactionDate).getFullYear();

            // Check if the transaction belongs to the current year
            if (transactionYear === currentYear) {
                sumForCurrentYear += (enrollment.transaction?.amount / 24000) * 0.2 ;
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
            // console.log("Sum for previous month:", sumForPreviousMonth);
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
            // console.log("Sum for today:", sumForToday);
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
            transactionList2.forEach((enrollment) => {
                const transactionDate = new Date(enrollment.transaction?.transactionDate);
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

    const [tutor, setTutor] = useState({
        id: "",
        account: []
    });

    const [course, setCourse] = useState({
        id: "",
        tutor: []
    });
    const [expandedDetail, setExpandedDetail] = useState({});


    const closeTransactionDetailModal = () => {
        setExpandedDetail(false);
    };

    const toggleDetail = async (id) => {
        try {
            const transactionRes = await transactionService.getTransactionById(id);
            const transaction = transactionRes.data;
            const courseRes = await courseService.getCourseById(transaction.courseId);
            const courseData = courseRes.data;

            if (!courseData.tutor?.isFreelancer) {
                const centerRes = await centerService.getCenterById(courseData.tutor?.centerId);
                setCenter(centerRes.data);
            }

            if (courseData.tutor?.isFreelancer) {
                const tutorRes = await tutorService.getTutorById(courseData.tutorId);
                setTutor(tutorRes.data);
            }

            setCourse(courseData);

            setExpandedDetail((prevState) => ({
                ...prevState,
                [id]: !prevState[id],
            }));
        } catch (error) {
            console.error('Error fetching transaction details:', error);
        }
    };


    //list transaction where courseId != null
    const [searchTerm2, setSearchTerm2] = useState('');
    const [currentPage2, setCurrentPage2] = useState(0);
    const [transactionsPerPage2] = useState(7);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const [transactionList2, setTransactionList2] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalNotPaid, setTotalNotPaid] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);
    const fetchTransactions2 = async () => {
        try {
            const res = await enrollmentService.getAllEnrollment();
            const transactions = res.data;

            // Filter transactions where transaction.courseId is not null
            const filteredTransactions = transactions.filter(enrollment => enrollment.transaction?.courseId
                !== null && enrollment.transaction?.status === "DONE" && enrollment.refundStatus === false);

            // Sort filtered transactions by transactionDate
            filteredTransactions.sort((a, b) => new Date(b.transaction?.transactionDate) - new Date(a.transaction?.transactionDate));

            // Calculate the total
            const calculatedTotal = filteredTransactions.reduce((acc, enrollment) => {
                return acc + (enrollment.transaction?.amount / 24000) * 0.2;
            }, 0);

            setTransactionList2(filteredTransactions);
            setTotal(calculatedTotal);
        } catch (error) {
            console.error("Error fetching transactions where courseId != null:", error);
        }
    }

    //for video course after 2 minutes lock refund button
    const isTransactionDateValid = (transactionDate) => {
        const currentDate = new Date();
        const diffInMilliseconds = currentDate - new Date(transactionDate);
        const diffInMinutes = diffInMilliseconds / (1000 * 60);
        return diffInMinutes <= 2;
    };


    //for class course after 7 days from first start date lock refund button
    const [classModuleDates, setClassModuleDates] = useState({});

    useEffect(() => {
        const fetchAndSetClassModuleDates = async () => {
            const dates = {};
            for (const enrollment of transactionList2) {
                if (enrollment.transaction?.course?.isOnlineClass) {
                    try {
                        const res = await courseService.getAllClassModulesByCourse(enrollment.transaction?.courseId);
                        const modules = res.data;
                        console.log(`Fetched modules for course ${enrollment.transaction?.courseId}:`, modules);

                        if (modules.length > 0) {
                            const startDates = modules.map(module => new Date(module.startDate));
                            console.log(`Start dates for course ${enrollment.transaction.courseId}:`, startDates);
                            const latestStartDate = new Date(Math.max(...startDates));
                            console.log(`Latest start date for course ${enrollment.transaction.courseId}:`, latestStartDate);

                            const currentDate = new Date();
                            console.log(`Current date: ${currentDate}`);
                            dates[enrollment.transaction.courseId] = latestStartDate < currentDate;

                        } else {
                            dates[enrollment.transaction.courseId] = false;
                        }
                    } catch (error) {
                        console.error(`Error fetching modules for course ${enrollment.transaction.courseId}:`, error);
                        dates[enrollment.transaction?.courseId] = false; // Assuming default to false in case of error
                    }
                }
            }
            setClassModuleDates(dates);
            console.log('Class module dates:', dates);
        };

        fetchAndSetClassModuleDates();
    }, [transactionList2]);

    useEffect(() => {
        const calculateTotals = () => {
            let notPaidTotal = 0;
            let paidTotal = 0;
            const currentDate = new Date();
    
            transactionList2.forEach(enrollment => {
                const isOnlineClass = enrollment.transaction?.course?.isOnlineClass;
                const amount = (enrollment.transaction?.amount / 24000) * 0.2;
                const enrolledDate = new Date(enrollment.enrolledDate);
    
                if (isOnlineClass) {
                    // For online classes, check against class module dates
                    if (classModuleDates[enrollment.transaction?.courseId] === false) {
                        notPaidTotal += amount;
                    } else if (classModuleDates[enrollment.transaction?.courseId] === true) {
                        paidTotal += amount;
                    }
                } else {
                    // For offline classes, check against 2-minute window
                    const diffInMinutes = (currentDate - enrolledDate) / (1000 * 60);
                    if (diffInMinutes <= 2) {
                        notPaidTotal += amount;
                    } else {
                        paidTotal += amount;
                    }
                }
            });
    
            setTotalNotPaid(notPaidTotal);
            setTotalPaid(paidTotal);
        };
    
        calculateTotals();
    }, [transactionList2, classModuleDates]);
    

    const handleSearch2 = (event) => {
        setSearchTerm2(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const filteredTransactions2 = transactionList2
        .filter((enrollment) => {
            const transactionDate = new Date(enrollment.transaction?.transactionDate);
            const transactionYear = transactionDate.getFullYear();
            const transactionMonth = transactionDate.getMonth() + 1; // getMonth() returns 0-11
            const matchesYear = selectedYear ? transactionYear.toString() === selectedYear : true;
            const matchesMonth = selectedMonth ? transactionMonth.toString() === selectedMonth : true;
            return matchesYear && matchesMonth && (
                enrollment.transaction?.course?.name.toLowerCase().includes(searchTerm2.toLowerCase()) ||
                enrollment.transaction?.course?.code.toLowerCase().includes(searchTerm2.toLowerCase()) ||
                enrollment.transaction?.learner?.account?.fullName.toLowerCase().includes(searchTerm2.toLowerCase()) ||
                enrollment.transaction?.learner?.account?.email.toLowerCase().includes(searchTerm2.toLowerCase())
            );
        });

    const pageCount2 = Math.ceil(filteredTransactions2.length / transactionsPerPage2);

    const handlePageClick2 = (data) => {
        setCurrentPage2(data.selected);
    };

    const offset2 = currentPage2 * transactionsPerPage2;
    const currentTransactions2 = filteredTransactions2.slice(offset2, offset2 + transactionsPerPage2);


    //EXPORT TO EXCEL
    const exportToExcel = () => {
        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Data for the sheet
        const data = [
            ["Year", selectedYear],
            ["Month", selectedMonth],
            [],
            ["Learner", "Course", "Date", "Payouts"]
        ];

        let totalAmount = 0;

        filteredTransactions2.forEach(cus => {

            const payout = ((cus.transaction?.amount / 24000) * 0.2).toFixed(2);
            totalAmount += parseFloat(payout);

            const row = [
                cus.transaction.learner?.account?.fullName,
                cus.transaction?.course?.name,
                new Date(cus.transaction?.transactionDate).toLocaleString('en-US'),
                `$${payout}`
            ];
            data.push(row);
        });

        data.push([]);
        data.push(["Total", "", "", `$${totalAmount.toFixed(2)}`]);

        // Convert data to a worksheet
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

        // Export the workbook
        XLSX.writeFile(wb, `Transactions_${selectedYear}_${selectedMonth}.xlsx`);
    };

    useEffect(() => {
        fetchMonthlyData();
    }, [transactionList2]);

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
                                                    <p className="text-muted mb-1 ">Earnings (Monthly)</p>
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
                                                    <h3 className="text-dark mt-1">$<span data-plugin="counterup">{(sumForCurrentYear).toFixed(2)}</span></h3>
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
                                        <h4 className="header-title mb-0">Estimate Total Revenue</h4>
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
                                        <h4 className="header-title mb-3">Transaction History</h4>
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
                                                                        <h5 className="m-0 font-weight-normal">{cus.learner?.account?.fullName}</h5>
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
                                                                                            <h4>Tutor {tutor.account?.fullName} receives <span class='text-danger'>80%</span> of <span class='text-danger'>${cus.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.amount / 24000) * 0.8}</span></h4>
                                                                                            
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
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card-box">
                                        <h4 className="header-title mb-3">Revenue History</h4>
                                        <div className="row">
                                            <div className="col-md-6 col-xl-4">
                                                <div className="widget-rounded-circle card-box">
                                                    <div className="row">

                                                        <div className="col-6">
                                                            <div className="text-right">
                                                                <h4 className="text-muted mb-1 text-truncate">Total Not Paid</h4>

                                                                <h3 className="mt-1 text-danger">$<span data-plugin="counterup">{totalNotPaid.toFixed(2)}</span></h3>
                                                            </div>
                                                        </div>
                                                        <div className="col-2">
                                                            <div className="avatar-lg">
                                                                <i className="fas fa-hand-holding-usd fa-4x text-danger"></i>
                                                            </div>
                                                        </div>
                                                    </div> {/* end row*/}
                                                </div> {/* end widget-rounded-circle*/}
                                            </div> {/* end col*/}
                                            <div className="col-md-6 col-xl-4">
                                                <div className="widget-rounded-circle card-box">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="text-right">
                                                                <h4 className="text-muted mb-1 text-truncate">Total Paid</h4>

                                                                <h3 className="mt-1 text-success">$<span data-plugin="counterup">{totalPaid.toFixed(2)}</span></h3>
                                                            </div>
                                                        </div>
                                                        <div className="col-2">
                                                            <div className="avatar-lg">
                                                                <i className="fas fa-coins fa-4x text-success"></i>
                                                            </div>
                                                        </div>
                                                    </div> {/* end row*/}
                                                </div> {/* end widget-rounded-circle*/}
                                            </div> {/* end col*/}
                                            <div className="col-md-6 col-xl-4">
                                                <div className="widget-rounded-circle card-box">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="text-right">
                                                                <h4 className="text-muted mb-1 text-truncate">Total</h4>

                                                                <h3 className="mt-1 text-primary">$<span data-plugin="counterup">{total.toFixed(2)}</span></h3>
                                                            </div>
                                                        </div>
                                                        <div className="col-2">
                                                            <div className="avatar-lg">
                                                                <i className="fas fa-funnel-dollar fa-4x text-primary"></i>
                                                            </div>
                                                        </div>
                                                    </div> {/* end row*/}
                                                </div> {/* end widget-rounded-circle*/}
                                            </div> {/* end col*/}


                                        </div>
                                        <div className="col-12 text-sm-center form-inline mb-2">
                                            <div className="form-group">
                                                <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm" autoComplete="on" value={searchTerm2}
                                                    onChange={handleSearch2} style={{ borderRadius: '50px', padding: `18px 25px` }} />
                                            </div>
                                            <div className="form-group ml-2">
                                                <select className="form-control" value={selectedYear} onChange={handleYearChange} style={{ borderRadius: '50px' }}>
                                                    <option value="">Select Year</option>
                                                    {[2022, 2023, 2024].map(year => (
                                                        <option key={year} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group ml-2">
                                                <select className="form-control" value={selectedMonth} onChange={handleMonthChange} style={{ borderRadius: '50px' }}>
                                                    <option value="">Select Month</option>
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                                                        <option key={month} value={month}>{month}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group ml-2">
                                                <button className="btn btn-success" onClick={exportToExcel} style={{ borderRadius: '50px' }}>
                                                    Export to Excel
                                                </button>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-btransactionless table-nowrap table-hover table-centered m-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>Learner</th>
                                                        <th>Course</th>
                                                        <th>Date</th>
                                                        <th>Payouts</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentTransactions2.length > 0 && currentTransactions2.map((cus) => (
                                                            <>
                                                                <tr>
                                                                    <td>
                                                                        <h5 className="m-0 font-weight-normal">{cus.transaction?.learner?.account?.fullName}</h5>
                                                                    </td>
                                                                    <td>
                                                                        <h5 className="m-0 font-weight-normal"><a href={`/edit-course/${cus.transaction?.course?.id}`} className="text-success">{cus.transaction?.course?.name}</a></h5>
                                                                    </td>
                                                                    <td>{new Date(cus.transaction?.transactionDate).toLocaleString('en-US')}</td>
                                                                    <td>
                                                                        <span style={{ fontWeight: 'bold' }}>Total:</span> <span className="text-primary" style={{ fontWeight: 'bold' }}>${(cus.transaction?.amount / 24000) * 0.2}</span>
                                                                        <div></div>
                                                                        {
                                                                            !cus.transaction?.course?.isOnlineClass &&
                                                                            new Date(cus.enrolledDate) < new Date(Date.now() - 2 * 60 * 1000) &&
                                                                            !cus.refundStatus && (
                                                                                <>
                                                                                    <span style={{ fontWeight: 'bold' }}>Paid:</span> <span className="text-success" style={{ fontWeight: 'bold' }}>${(cus.transaction?.amount / 24000) * 0.2}</span>
                                                                                    <div> </div>
                                                                                    <span style={{ fontWeight: 'bold' }}>Not Paid:</span> <span className="text-danger" style={{ fontWeight: 'bold' }}>$0</span>
                                                                                </>
                                                                            )
                                                                        }
                                                                        {
                                                                            !cus.transaction?.course?.isOnlineClass &&
                                                                            new Date(cus.enrolledDate) > new Date(Date.now() - 2 * 60 * 1000) && (
                                                                                <>
                                                                                    <span style={{ fontWeight: 'bold' }}>Paid:</span> <span className="text-success" style={{ fontWeight: 'bold' }}>$0</span>
                                                                                    <div></div>
                                                                                    <span style={{ fontWeight: 'bold' }}>Not Paid:</span> <span className="text-danger" style={{ fontWeight: 'bold' }}>${(cus.transaction?.amount / 24000) * 0.2}</span>
                                                                                </>
                                                                            )
                                                                        }

                                                                        {cus.transaction?.course?.isOnlineClass && (
                                                                            <>
                                                                                {classModuleDates[cus.transaction?.courseId] ? (
                                                                                    <>
                                                                                        <span style={{ fontWeight: 'bold' }}>Paid:</span> <span className="text-success" style={{ fontWeight: 'bold' }}>${(cus.transaction?.amount / 24000) * 0.2}</span>
                                                                                        <div> </div>
                                                                                        <span style={{ fontWeight: 'bold' }}>Not Paid:</span> <span className="text-danger" style={{ fontWeight: 'bold' }}>$0</span>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <span style={{ fontWeight: 'bold' }}>Paid:</span> <span className="text-success" style={{ fontWeight: 'bold' }}>$0</span>
                                                                                        <div> </div>
                                                                                        <span style={{ fontWeight: 'bold' }}>Not Paid:</span> <span className="text-danger" style={{ fontWeight: 'bold' }}>${(cus.transaction?.amount / 24000) * 0.2}</span>
                                                                                    </>
                                                                                )}
                                                                            </>
                                                                        )}


                                                                    </td>


                                                                    {
                                                                        cus.transaction?.course !== null && cus.transaction?.status === "DONE" && (
                                                                            <td>
                                                                                <i className="fa-regular fa-eye" style={{ cursor: 'pointer' }} onClick={() => toggleDetail(cus.transaction?.id)}></i>
                                                                            </td>
                                                                        )
                                                                    }
                                                                </tr>
                                                                {expandedDetail[cus.transaction?.id] && (
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
                                                                                    <h4>Amount: <span className='text-danger'>${cus.transaction?.amount / 24000}</span></h4>
                                                                                    {course.tutor?.isFreelancer && (
                                                                                        <>
                                                                                            <h4>Meowlish receives <span class='text-danger'>20%</span> of <span class='text-danger'>${cus.transaction?.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.transaction?.amount / 24000) * 0.2}</span></h4>
                                                                                            <h4>Tutor {tutor.account?.fullName} receives <span class='text-danger'>80%</span> of <span class='text-danger'>${cus.transaction?.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.transaction?.amount / 24000) * 0.8}</span></h4>
                                                                                        </>
                                                                                    )}
                                                                                    {!course.tutor?.isFreelancer && (
                                                                                        <>
                                                                                            <h4>Meowlish receives <span class='text-danger'>20%</span> of <span class='text-danger'>${cus.transaction?.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.transaction?.amount / 24000) * 0.2}</span></h4>
                                                                                            <h4>Center {center.name} receives <span class='text-danger'>80%</span> of <span class='text-danger'>${cus.transaction?.amount / 24000}</span> ={'>'} <span class='text-success'>${(cus.transaction?.amount / 24000) * 0.8}</span></h4>

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
                                                currentTransactions2.length === 0 && (
                                                    <p className="mt-3">No transactions found.</p>
                                                )
                                            }
                                        </div> {/* end .table-responsive*/}
                                        <div className='container-fluid mt-3'>
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
                                                    pageCount={pageCount2}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={5}
                                                    onPageChange={handlePageClick2}
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
                                    </div>
                                </div>
                            </div>
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
                                        .page-item.active .page-link{
                                            background-color: #20c997;
                                            border-color: #20c997;
                                        }
                        
                                        
                                        `}
            </style>
        </>
    )
}

export default AdminDashboard