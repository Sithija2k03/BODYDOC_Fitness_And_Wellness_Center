import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import avatar_m from '../../img/avatar_m.png';
import navItems from '../../utils/navItems';

function Navigation({ active: externalActive, setActive: externalSetActive }) {
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [internalActive, setInternalActive] = useState(1); // fallback default
    const navigate = useNavigate(); 
    const [userName, setUserName] = useState('');

    const active = externalActive ?? internalActive;
    const setActive = externalSetActive ?? setInternalActive;

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userObj = JSON.parse(storedUser); 
            setUserName(userObj.fullName); 
        }
    }, []);

    const handleNavClick = (id, path = null) => {
        if (id === 6) {
            setInventoryOpen(!inventoryOpen);
        } else {
            setActive(id);
            setInventoryOpen(false); 
            if (path) {
                navigate(path);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken'); 
        localStorage.removeItem('userName'); 
        navigate('/login'); 
    };

    return (
        <NavStyled>
            <div className="user-icon">
                <img src={avatar_m} alt="avatar" />
                <div className="text">
                    <h2>{userName}</h2>
                    <p>Admin Dashboard</p>
                </div>
            </div>
            <ul className="nav-items">
                {navItems.map((item) => (
                    <React.Fragment key={item.id}>
                        <li
                            onClick={item.id === 8 ? handleLogout : () => handleNavClick(item.id, item.path)}
                            className={active === item.id ? 'active' : ''}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                            {item.id === 6 && <span className="dropdown-arrow">▼</span>}
                        </li>
                        {item.id === 6 && inventoryOpen && (
                            <ul className="dropdown-menu">
                                <li onClick={() => handleNavClick(61, '/pharmacy-items')}>Pharmacy Items</li>
                                <li onClick={() => handleNavClick(62, '/gymEquipment')}>Gym Equipment</li>
                            </ul>
                        )}
                    </React.Fragment>
                ))}
            </ul>
        </NavStyled>
    );
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 270px;
    height: 100vh;
    background: rgba(252, 246, 249, 0.8);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(5px);
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between; 
    gap: 2rem;

    .user-icon {
        height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            background: #fcf6f9;
            border: 3px solid #FFFFFF;
            padding: 0.2rem;
            box-shadow: 0 1px 7px rgba(0, 0, 0, 0.06);
        }

        h2 {
            color: rgba(34, 34, 96, 1);
            margin-left: -.6rem;
        }

        p {
            color: rgba(34, 34, 96, 0.6);
            margin-left: -.6rem;
        }
    }

    .nav-items {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.8rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.4s ease-in-out;
            color: rgba(34, 34, 96, 0.6);
            padding: 0.5rem;
            border-radius: 10px;
            position: relative;

            &:hover {
                background: rgba(34, 34, 96, 0.1);
            }

            .dropdown-arrow {
                margin-left: auto;
                font-size: 12px;
            }
        }
    }

    .dropdown-menu {
        list-style: none;
        padding: 0;
        margin: 0;
        background: white;
        border-radius: 5px;
        border: 1px solid #ddd;
        position: relative;
        left: 20px;
        top: 5px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
        width: 200px;

        li {
            padding: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;

            &:hover {
                background: #f5f5f5;
            }
        }
    }

    .active {
        color: rgba(34, 34, 96, 1)!important;

        i {
            color: rgba(34, 34, 96, 1)!important;
        }

        &::before {
            content: '';
            position: relative;
            left: 0;
            top: 0;
            width: 8px;
            height: 100%;
            background: #222260;
            border-radius: 0 10px 10px 0;
        }
    }
`;

export default Navigation;
