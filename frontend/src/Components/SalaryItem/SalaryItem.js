import React from 'react';
import styled from 'styled-components';
import { dateFormat } from '../../utils/dateFormat';
import { useGlobalContext } from '../../context/globalContext';
import { trash, edit, fileText } from '../../utils/icons';  // Add an icon for the "Generate Payslip" button
import { PDFDownloadLink, Document, Page, Text, View,Image, StyleSheet } from '@react-pdf/renderer';
import bgLogo from '../../img/bodydoc.png';

// SalaryItem component to display individual salary details
function SalaryItem({
    id,
    employeeId,
    basicSalary,
    allowances,
    deductions,
    otHours,
    otRate,
    epfRate,
    etfRate,
    netSalary,
    paymentDate,
    status,
    deleteItem,
    editItem
}) {
    const { updateSalaryStatus } = useGlobalContext();  

    // Handle status update (Pending -> Paid, Paid -> Pending)
    const handleUpdateStatus = () => {
        const newStatus = status === "Pending" ? "Paid" : "Pending";
        updateSalaryStatus(id, newStatus); 
    };

    const generatePayslip = () => (
        <Document>
            <Page style={styles.page}>
                <Image src={bgLogo} style={styles.logo} />
                <Text style={styles.header}>Payslip</Text>
    
                <View style={styles.section}>
                    <Text>Employee: {employeeId ? employeeId.fullName : 'No Name Available'}</Text>
                    <Text>Payment Date: {dateFormat(paymentDate)}</Text>
                    <Text>Status: {status}</Text>
                </View>
    
                <View style={styles.table}>
                    <View style={[styles.row, { backgroundColor: '#ddd' }]}>
                        <Text style={styles.column}>Description</Text>
                        <Text style={styles.column}>Amount</Text>
                    </View>
                    <View style={styles.row}><Text style={styles.column}>Basic Salary</Text><Text style={styles.column}>{basicSalary}</Text></View>
                    <View style={styles.row}><Text style={styles.column}>Allowances</Text><Text style={styles.column}>{allowances}</Text></View>
                    <View style={styles.row}><Text style={styles.column}>Deductions</Text><Text style={styles.column}>{deductions}</Text></View>
                    <View style={styles.row}><Text style={styles.column}>OT Hours</Text><Text style={styles.column}>{otHours}</Text></View>
                    <View style={styles.row}><Text style={styles.column}>OT Rate</Text><Text style={styles.column}>{otRate}</Text></View>
                    <View style={styles.row}><Text style={styles.column}>OT Pay</Text><Text style={styles.column}>{(otHours * (basicSalary / 160) * otRate).toFixed(2)}</Text></View>
                    <View style={styles.row}><Text style={styles.column}>EPF Deduction ({epfRate}%)</Text><Text style={styles.column}>{(basicSalary * (epfRate / 100)).toFixed(2)}</Text></View>
                    <View style={styles.row}><Text style={styles.column}>ETF Deduction ({etfRate}%)</Text><Text style={styles.column}>{(basicSalary * (etfRate / 100)).toFixed(2)}</Text></View>
                    <View style={[styles.row, { backgroundColor: '#ddd' }]}>
                        <Text style={[styles.column, { fontWeight: 'bold' }]}>Net Salary</Text>
                        <Text style={[styles.column, { fontWeight: 'bold' }]}>{netSalary}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );

    return (
        <SalaryItemStyled>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Basic Salary</th>
                            <th>Allowances</th>
                            <th>Deductions</th>
                            <th>OT Hours</th>
                            <th>Net Salary</th>
                            <th>Payment Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{employeeId ? employeeId.fullName : "No Name Available"}</td>
                            <td>{basicSalary}</td>
                            <td>{allowances}</td>
                            <td>{deductions}</td>
                            <td>{otHours}</td>
                            <td>{netSalary}</td>
                            <td>{dateFormat(paymentDate)}</td>
                            <td>
                                <button onClick={handleUpdateStatus} className={status === "Paid" ? "paid-btn" : "pending-btn"}>
                                    {status}
                                </button>
                            </td>
                            <td>
                                <div className='actions'>
                                    <button className='delete-btn' onClick={() => deleteItem(id)}>{trash}</button>
                                    {status === "Paid" && (
                                        <PDFDownloadLink document={generatePayslip()} fileName={`Payslip_${id}.pdf`}>
                                            <button className='payslip-btn'>
                                                {fileText} Generate Payslip
                                            </button>
                                        </PDFDownloadLink>
                                    )}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </SalaryItemStyled>
    );
}

const SalaryItemStyled = styled.div`
    overflow-x: auto;

    .table-container {
        max-width: 1000px;  /* Set a max width for the table */
        margin: 0 auto;  /* Center the table */
    }

    table {
        margin-left: -20px;
        border-collapse: collapse;
        background: #FCF6F9;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        table-layout: auto; /* Ensures even distribution of space */
        width: 100%;
    }

    th, td {
        padding: 2px 6px;  /* Reduced padding to minimize gap */
        text-align: left;
        border-bottom: 1px solid #ddd;
        font-size: 0.75rem; /* Smaller font size */
    }

    th {
        background: #F5F5F5;
        font-weight: bold;
        padding: 4px 6px;  /* Reduced padding on header */
    }

    .paid-btn {
        background: green;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 4px 8px;
        cursor: pointer;
    }

    .pending-btn {
        background: orange;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 4px 8px;
        cursor: pointer;
    }

    .actions {
        display: flex;
        gap: 8px;
        justify-content: flex-start;
    }

    .edit-btn, .delete-btn, .payslip-btn {
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 1rem;
    }

    .delete-btn {
        color: red;
        margin-left: -40px;
    }

    .edit-btn {
        color: blue;
    }

    .payslip-btn {
        color: green;
        font-size: 0.9rem;
        margin-left: 10px;
        padding: 4px 8px;
        background: lightgreen;
        border-radius: 5px;
    }
`;

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
        fontFamily: 'Helvetica',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
        alignSelf: 'center',
    },
    header: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    section: {
        marginBottom: 10,
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#000',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        padding: 5,
    },
    column: {
        flex: 1,
        textAlign: 'center',
    },
});

export default SalaryItem;
