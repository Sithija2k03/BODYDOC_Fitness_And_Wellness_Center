// components/UserItem.js
import React from "react";

const UserItem = ({ user, onDelete }) => {
    const { _id, fullName, email, gender, dateofBirth, phone, role } = user;

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to deactivate ${fullName}?`)) {
            onDelete(_id);
        }
    };

    const formattedDOB = new Date(dateofBirth).toLocaleDateString("en-US");

    return (
        <tr>
            <td>{fullName}</td>
            <td>{email}</td>
            <td>{gender}</td>
            <td>{formattedDOB}</td>
            <td>{phone}</td>
            <td>{role}</td>
            <td>
                <button className="deactivate" onClick={handleDelete}>
                    Deactivate
                </button>
            </td>
        </tr>
    );
};

export default UserItem;
