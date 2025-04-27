import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import UserItem from "./UserItem"; 

const DisplayAllUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:4000/user"); // ✅ Fetch all users
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:4000/user/delete/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
    

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            <h1>All Users</h1>
            <SearchBar
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Date of Birth</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <UserItem key={user._id} user={user} onDelete={handleDeleteUser} />
                        ))}
                    </tbody>
                </table>
            </div>
        </Container>
    );
};

// Styled Components
const Container = styled.div`
    padding: 20px;
    h1 {
        margin-bottom: 20px;
    }
    .table-container {
        overflow-x: auto;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        background: #ffffff;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        overflow: hidden;
    }
    th, td {
        padding: 12px 16px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
        font-size: 0.9rem;
        color: #333;
    }
    th {
        background: #e0e0e0;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.85rem;
        color: #555;
        letter-spacing: 0.5px;
    }
    tbody tr:hover {
        background: #f9f9f9;
    }
    .deactivate {
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    background: #dc3545;
    color: white;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    transition: background 0.2s ease;
}

.deactivate:hover {
    background: #c82333;
}    
`;

const SearchBar = styled.input`
    padding: 10px 15px;
    margin-bottom: 20px;
    width: 100%;
    max-width: 400px;
    border: 1px solid #ccc;
    border-radius: 25px;
    font-size: 1rem;
`;

export default DisplayAllUsers;
