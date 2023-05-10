import React from "react";
import logo from '../images/logo.svg';
import { NavLink } from "react-router-dom";

function Header() {
        return (
            <header className="header" role="banner">
                <h1><NavLink to="/"><img src={logo} alt="John Nguyen" /></NavLink></h1>
                <div className="navContainer">
                    <nav>
                        <ul>
                            <li>
                                <NavLink to="/" className={({ isActive }) => isActive ? "is-active" : "nav-link" }>
                                    Projects
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about/" className={({ isActive }) => isActive ? "is-active" : "nav-link" }>
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact/" className={({ isActive }) => isActive ? "is-active" : "nav-link" }>
                                    Contact
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
}

export default Header;