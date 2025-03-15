import React from 'react';
import styled from 'styled-components';
import avatar_m from '../../img/avatar_m.png';
import { navItems } from '../../utils/navItems';
import { logout } from '../../utils/icons';


function Navigation({ active, setActive }) {
    
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
                {navItems.map((item) => {
                    return (
                        <li key={item.id}
                            onClick={() => setActive(item.id)}
                            className={active === item.id ? 'active' : ''}
                            >
                            {item.icon}
                            <span>{item.title}</span>
                        </li>
                    );
                })}
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
    width: 375px;
    height: 100vh; /* Full height of the viewport */
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
        flex: 1; /* Takes up remaining space */
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* Space between list items */

        li {
            display: flex;
            align-items: center;
            gap: 0.8rem;  /* Space between icon and text */
            font-weight: 500;
            cursor: pointer;
            transition: all 0.4s ease-in-out;
            color: rgba(34, 34, 96, 0.6);
            padding: 0.5rem 0.5rem; /* Padding for better spacing */
            border-radius: 10px; /* Rounded corners */

            &:hover {
                background: rgba(34, 34, 96, 0.1); /* Hover effect */
            }

            span {
                font-size: 1rem;
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
        width: 5px;
        height: 100%;
        background: #222260;
        border-radius: 0 10px 10px 0;
    }
}
`;

export default Navigation;