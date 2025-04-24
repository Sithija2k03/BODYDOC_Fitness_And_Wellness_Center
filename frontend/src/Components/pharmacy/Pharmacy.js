import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Button from '../Button/Button';
import { plus, search, fileText } from '../../utils/icons'; // Added search and fileText icons
import Modal from '../Modal/Modal';
import PharmacyForm from '../Form/PharmacyForm';
import Navigation from '../../Components/Navigation/Navigation';
import jsPDF from 'jspdf'; // Import jsPDF
import autoTable from 'jspdf-autotable'; // Import autoTable directly

function Pharmacy() {
    const {
        pharmacyItems,
        getPharmacyItems,
        addPharmacyItem,
        deletePharmacyItem,
        error,
        success,
        setSuccess
    } = useGlobalContext();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // Added state for search term

    useEffect(() => {
        getPharmacyItems();
    }, [getPharmacyItems]);

    useEffect(() => {
        if (success) {
            alert(success);
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success, setSuccess]);

    useEffect(() => {
        console.log('Pharmacy Items:', pharmacyItems); // Debug: Inspect the data
    }, [pharmacyItems]);

    const openForm = () => setIsFormOpen(true);
    const closeForm = () => setIsFormOpen(false);

    // Filter pharmacy items based on search input
    const filteredPharmacyItems = pharmacyItems.filter((item) =>
        item?.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        autoTable(doc, {
            head: [['Item Number', 'Item Name', 'Category', 'Stock Qty', 'Reorder Level', 'Supplier', 'Supplier ID', 'Order Qty', 'Unit Price', 'Total Price', 'Order Date']],
            body: filteredPharmacyItems.map((item) => [
                item.itemNumber || 'N/A',
                item.itemName || 'N/A',
                item.itemCategory || 'N/A',
                item.availableStockQty || '0',
                item.reorderLevel || '0',
                item.supplierName || 'N/A',
                item.supplierId || 'N/A',
                item.orderQty || '0',
                item.unitPrice || '0',
                item.totalAmount || '0',
                item.orderDate ? new Date(item.orderDate).toLocaleDateString() : 'N/A'
            ]),
            startY: 30,
            styles: {
                fontSize: 10,
                cellPadding: 3,
                overflow: 'linebreak'
            },
            headStyles: {
                fillColor: [245, 102, 146], // Pink background for headers (matches #F56692)
                textColor: [255, 255, 255], // White text for headers
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250] // Light gray background for alternate rows (matches #fafafa)
            },
            margin: { top: 30 },
            didDrawPage: (data) => {
                // Add document title on the first page
                doc.setFontSize(18);
                doc.text('Pharmacy Inventory', 14, 22);
            }
        });

        // Save the PDF
        doc.save('pharmacy-inventory.pdf');
    };

    // Inline PharmacyItem component to ensure correct rendering
    const PharmacyItem = ({
        id,
        itemNumber,
        itemName,
        itemCategory,
        availableStockQty,
        reorderLevel,
        supplierName,
        supplierId,
        orderQty,
        unitPrice,
        totalAmount,
        orderDate,
        deletePharmacyItem
    }) => {
        return (
            <tr>
                <td>{itemNumber || 'N/A'}</td>
                <td>{itemName || 'N/A'}</td>
                <td>{itemCategory || 'N/A'}</td>
                <td>{availableStockQty || '0'}</td>
                <td>{reorderLevel || '0'}</td>
                <td>{supplierName || 'N/A'}</td>
                <td>{supplierId || 'N/A'}</td>
                <td>{orderQty || '0'}</td>
                <td>{unitPrice || '0'}</td>
                <td>{totalAmount || '0'}</td>
                <td>{orderDate ? new Date(orderDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button className="delete-btn" onClick={() => deletePharmacyItem(itemNumber)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <MainLayout>
            <div className="page-content">
                <Navigation />
                <PharmacyStyled>
                    <InnerLayout>
                        <h1>Pharmacy Inventory</h1>
                        <SearchBarContainer>
                            <input
                                type="text"
                                placeholder="Search item by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="search-icon">{search}</div>
                        </SearchBarContainer>
                        <div className="submit-btn">
                            <Button
                                name={'Add Item'}
                                icon={plus}
                                bPad={'.8rem 1.6rem'}
                                bRad={'30px'}
                                bg={'#F56692'}
                                color={'#fff'}
                                onClick={openForm}
                            />
                            <Button
                                name={'Generate PDF'}
                                icon={fileText}
                                bPad={'.8rem 1.6rem'}
                                bRad={'30px'}
                                bg={'#F56692'}
                                color={'#fff'}
                                onClick={generatePDF}
                            />
                        </div>
                        <div className="pharmacy-item-list">
                            {pharmacyItems.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item Number</th>
                                            <th>Item Name</th>
                                            <th>Category</th>
                                            <th>Stock Qty</th>
                                            <th>Reorder Level</th>
                                            <th>Supplier</th>
                                            <th>Supplier ID</th>
                                            <th>Order Qty</th>
                                            <th>Unit Price</th>
                                            <th>Total Price</th>
                                            <th>Order Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPharmacyItems.length > 0 ? (
                                            filteredPharmacyItems.map((item) => (
                                                <PharmacyItem
                                                    key={item._id}
                                                    id={item._id}
                                                    itemNumber={item.itemNumber}
                                                    itemName={item.itemName}
                                                    itemCategory={item.itemCategory}
                                                    availableStockQty={item.availableStockQty}
                                                    reorderLevel={item.reorderLevel}
                                                    supplierName={item.supplierName}
                                                    supplierId={item.supplierId}
                                                    orderQty={item.orderQty}
                                                    unitPrice={item.unitPrice}
                                                    totalAmount={item.totalAmount}
                                                    orderDate={item.orderDate}
                                                    deletePharmacyItem={deletePharmacyItem}
                                                />
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="12">No pharmacy items match your search</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No pharmacy items available</p>
                            )}
                        </div>
                    </InnerLayout>

                    <Modal isOpen={isFormOpen} onClose={closeForm}>
                        <PharmacyForm onClose={closeForm} onSubmit={addPharmacyItem} />
                    </Modal>
                </PharmacyStyled>
            </div>
        </MainLayout>
    );
}

const MainLayout = styled.div`
    display: flex;
    height: 100vh;
    background: linear-gradient(135deg, rgba(245, 102, 146, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%);
    padding: 2rem;

    .page-content {
        display: flex;
        flex: 1;
        background: white;
        border-radius: 20px;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    > .page-content > nav {
        width: 250px;
        min-width: 250px;
        background-color: #f8f8f8;
        height: 100%;
    }

    > .page-content > div {
        flex: 1;
        overflow-y: auto;
    }
`;

const PharmacyStyled = styled.div`
    flex: 1;

    .submit-btn {
        margin: 1rem 0;
        display: flex;
        gap: 1rem; // Add spacing between buttons
        justify-content: center;

        button {
            box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.06);
        }
    }

    .pharmacy-item-list {
        margin-top: 1rem;
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    th, td {
        padding: 0.8rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    th {
        background-color: #f2f2f2;
        font-weight: 600;
        width: 8.33%; // 100% / 12 columns
    }

    td {
        background-color: #fafafa;
    }

    tr:hover td {
        background-color: #f0f0f0;
    }

    .delete-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
        background-color: #f44336;
        color: white;
    }

    .delete-btn:hover {
        background-color: #d32f2f;
    }

    p {
        text-align: center;
        font-size: 1rem;
        color: #666;
        margin: 2rem 0;
    }
`;

const SearchBarContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    margin-left: 15px;

    input {
        background: #FFFFFF;
        width: 100%;
        max-width: 400px;
        padding: 10px 40px 10px 10px;
        border: 2px solid #228B22;
        border-radius: 20px;
        font-size: 1rem;
        outline: none;
        transition: 0.3s ease-in-out;

        &:focus {
            border-color: var(--color-primary);
            box-shadow: 0 0 5px var(--color-primary);
        }
    }

    .search-icon {
        width: 60px;
        height: 60px;
        position: absolute;
        left: 790px;
        top: 160px;
        color: var(--color-primary);
        cursor: pointer;
    }
`;



export default Pharmacy;