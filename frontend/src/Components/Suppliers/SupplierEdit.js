import React, { useEffect } from 'react';
import styled from 'styled-components';
import SupplierForm from '../Form/SupplierForm';
import SupplierItem from '../Suppliers/SupplierItem';
import { useGlobalContext } from '../../../../frontendIE/src/context/globalContext';
import { InnerLayout } from '../../../../frontendIE/src/styles/Layouts';


function EditSupplierForm({ updateSupplier }) {
    const { id } = useParams();  // Get the supplier ID from the URL
    const { suppliers, getSuppliers } = useGlobalContext();
    const [supplierDetails, setSupplierDetails] = useState({
        supplier_name: '',
        contact: '',
        credits: '',
        supplyCategory: '',
    });
    const history = useHistory();

    // Fetch suppliers when the component is mounted
    useEffect(() => {
        getSuppliers(); // Fetch all suppliers when the page loads
    }, [getSuppliers]);

    // Find the supplier by id and pre-fill the form
    useEffect(() => {
        const supplier = suppliers.find((sup) => sup.supplier_id === id);
        if (supplier) {
            setSupplierDetails(supplier);
        }
    }, [suppliers, id]);

    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSupplierDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        updateSupplier(supplierDetails);
        history.push('/');  // Redirect to the supplier list after updating
    };

    return (
        <EditSupplierFormStyled>
            <h1>Edit Supplier</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Supplier Name</label>
                    <input
                        type="text"
                        name="supplier_name"
                        value={supplierDetails.supplier_name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Contact</label>
                    <input
                        type="text"
                        name="contact"
                        value={supplierDetails.contact}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Credits</label>
                    <input
                        type="number"
                        name="credits"
                        value={supplierDetails.credits}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Category</label>
                    <input
                        type="text"
                        name="supplyCategory"
                        value={supplierDetails.supplyCategory}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </EditSupplierFormStyled>
    );
}

const EditSupplierFormStyled = styled.div`
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;

    form {
        display: flex;
        flex-direction: column;
        gap: 15px;

        div {
            display: flex;
            flex-direction: column;

            label {
                font-weight: bold;
                margin-bottom: 5px;
            }

            input {
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
            }

            button {
                padding: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                &:hover {
                    background-color: #388e3c;
                }
            }
        }
    }
`;

export default EditSupplierForm;