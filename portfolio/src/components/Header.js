import React, { Component } from "react";
import logo from '../images/logo.svg';
import { NavLink } from 'react-router-dom'

export default class Header extends Component {
    render() {
        return (
            <header>
                <h1><NavLink to="/" exact><img src={logo} alt="John Nguyen" /></NavLink></h1>
                <div className="navContainer">
                    <nav>
                        <ul>
                            <li>
                                <NavLink to="/" exact activeClassName="is-active" className="nav-link">
                                    Projects
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about/" activeClassName="is-active" className="nav-link">
                                    About
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact/" activeClassName="is-active" className="nav-link">
                                    Contact
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}