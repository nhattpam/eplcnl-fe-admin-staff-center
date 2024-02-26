import React, { useState } from 'react'
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import accountService from '../../services/account.service'
import staffService from '../../services/staff.service'
import * as XLSX from 'xlsx';

const CreateStaff = () => {

    const centerId = localStorage.getItem('centerId');
    const navigate = useNavigate();



    const [account, setAccount] = useState({
        fullName: "",
        email: "",
        password: "",
        isActive: true,
        roleId: '887428d0-9ded-449c-94ee-7c8a489ab763', //role cua staff
        gender: true
    });


    const [staff, setStaff] = useState({
        accountId: "",
    });


    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState("");
    const [fileData, setFileData] = useState([]); // State to hold uploaded file data


    const handleChange = (e) => {
        const value = e.target.value;
        setAccount({ ...account, [e.target.name]: value });
    }

    const handleDropdownChange = (e) => {
        const value = e.target.value;
        if (value === "Male") {
            setAccount({ ...account, gender: true });
        }
        if (value === "Female") {
            setAccount({ ...account, gender: false });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const range = XLSX.utils.decode_range(sheet['!ref']);
            range.s.r++;
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, range });
            setFileData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (account.fullName.trim() === '') {
            errors.fullName = 'Full Name is required';
            isValid = false;
        }

        if (account.password.trim() === '') {
            errors.password = 'Password is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };


    const submitAccount = async (e) => {
        e.preventDefault();
        if (fileData.length > 0) {
            const promises = fileData.map(async (rowData, index) => {
                const newAccount = {
                    fullName: `${rowData[0] || ""}`, // Surround with double quotes
                    email: `${rowData[1] || ""}`, // Surround with double quotes
                    password: `${rowData[2] || ""}`, // Surround with double quotes
                    isActive: true, // Always true
                    roleId: '887428d0-9ded-449c-94ee-7c8a489ab763', // Role ID
                    gender: false // Assuming gender is always false
                };
                console.log('Account Data:', JSON.stringify(newAccount, null, 4));


                // Save account
                const accountResponse = await accountService.saveAccount(newAccount);
                console.log('Account Response:', accountResponse.data);

                // Update tutor with accountId and save tutor
                const updatedStaff = { ...staff, accountId: accountResponse.data.id };
                console.log('Updated Staff:', updatedStaff);
                const staffResponse = await staffService.saveStaff(updatedStaff);
                console.log('Staff Response:', staffResponse.data);

                return { account: accountResponse.data, staff: staffResponse.data };
            });

            const results = await Promise.all(promises);
            console.log('Results:', results);
            setMsg('Account and Staff Added Successfully');
            navigate(`/list-staff`);
        }
        else {
            if (validateForm()) {
                try {
                    // Save account
                    console.log(JSON.stringify(account))
                    const accountResponse = await accountService.saveAccount(account);
                    console.log(accountResponse.data);

                    // Update staff with accountId and save staff
                    const updatedStaff = { ...staff, accountId: accountResponse.data.id };
                    setStaff(updatedStaff);

                    console.log(updatedStaff)

                    const staffResponse = await staffService.saveStaff(updatedStaff);
                    console.log(staffResponse.data);

                    setMsg('Account and Staff Added Successfully');

                    navigate(`/list-staff`);

                } catch (error) {
                    console.log(error);
                }
            }
        }

    };

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
                                    <h4 className="header-title">CREATE NEW STAFF</h4>
                                    <form id="demo-form" data-parsley-validate onSubmit={(e) => submitAccount(e)}>
                                        <div className="form-group">
                                            <label htmlFor="fullName">Full Name * :</label>
                                            <input type="text" className="form-control" name="fullName" id="fullName"  
                                            value={account.fullName} onChange={(e) => handleChange(e)} style={{ width: '70%' }}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email * :</label>
                                            <input type="email" id="email" className="form-control" name="email" data-parsley-trigger="change"  
                                            value={account.email} onChange={(e) => handleChange(e)} style={{ width: '70%' }}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password * :</label>
                                            <input type="password" className="form-control" name="password" id="password" 
                                             value={account.password} onChange={(e) => handleChange(e)} style={{ width: '70%' }}/>
                                        </div>
                                        <div className="form-group">
                                            <label>Gender *:</label>
                                            <select
                                                id="gender"
                                                name="gender"
                                                className="form-control"
                                                value={account.gender === null ? '' : account.gender ? 'Male' : 'Female'}
                                                onChange={(e) => handleDropdownChange(e)}
                                                style={{ width: '70%' }}
                                            >
                                                <option value="" disabled>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>


                                        </div>
                                        {/* File upload input */}
                                        <div className="form-group">
                                            <label htmlFor="file">Upload Excel file: </label>&nbsp;
                                            <input type="file" id="file" accept=".xlsx,.xls" onChange={handleFileChange} />
                                        </div>
                                        <div className="form-group mb-0">
                                            {/* Approve Button */}
                                            <button type="submit" className="btn btn-success mr-2">
                                                <i className="bi bi-check-lg"></i> Create
                                            </button>

                                        </div>
                                    </form>
                                    {/* Table to display tutor information from Excel */}
                                    {fileData.length > 0 && (
                                        <div className="mt-4" style={{ width: '70%' }}>
                                            <h5>Staff Information from Uploaded Excel</h5>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Full Name</th>
                                                        <th>Email</th>
                                                        <th>Password</th>
                                                        {/* Add more columns as needed */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {fileData.map((rowData, rowIndex) => (
                                                        <tr key={rowIndex}>
                                                            <td>{rowData[0]}</td> {/* Assuming the first column is Full Name */}
                                                            <td>{rowData[1]}</td> {/* Assuming the second column is Email */}
                                                            <td>{rowData[2]}</td> {/* Assuming the second column is Email */}

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
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
                    width: 100%;
                    text-align: left;
                }
            `}
            </style>
        </>
    )
}

export default CreateStaff