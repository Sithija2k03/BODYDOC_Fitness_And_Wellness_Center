import React, { useState } from 'react';
import styled from 'styled-components';
import avatar_m from '../../img/avatar_m.png';
import { navItems } from '../../utils/navItems';
import { logout } from '../../utils/icons';

function Navigation({ active, setActive }) {
    const [inventoryOpen, setInventoryOpen] = useState(false);

    const handleNavClick = (id) => {
        if (id === 6) {
            setInventoryOpen(!inventoryOpen);
        } else {
            setActive(id);
            setInventoryOpen(false); // Close dropdown if another menu item is clicked
        }
    };

    return (
        <NavStyled>
            <div className="user-icon">
                <img src={avatar_m} alt="avatar" />
                <div className="text">
                    <h2>Sithija</h2>
                    <p>Admin Financial Dashboard</p>
                </div>
            </div>
            <ul className="nav-items">
                {navItems.map((item) => (
                    <React.Fragment key={item.id}>
                        <li
                            onClick={() => handleNavClick(item.id)}
                            className={active === item.id ? 'active' : ''}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                            {item.id === 6 && <span className="dropdown-arrow">▼</span>}
                        </li>
                        {item.id === 6 && inventoryOpen && (
                            <ul className="dropdown-menu">
                                <li onClick={() => setActive(61)}>Pharmacy Items</li>
                                <li onClick={() => setActive(62)}>Gym Equipment</li>
                            </ul>
                        )}
                    </React.Fragment>
                ))}
            </ul>
            <div className="bottom-nav">
                <div className='logout'>
                    {logout}
                    <span>Log out</span>
                </div>
            </div>
        </NavStyled>
    );
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 320px;
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
        }

        p {
            color: rgba(34, 34, 96, 0.6);
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
