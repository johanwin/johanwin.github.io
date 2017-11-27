import React, { Component } from "react";
import {Helmet} from "react-helmet";
import { Link } from 'react-router-dom';

export default class Error extends Component {
	render() {
		return (
            <section className="error">
                <Helmet>
                    <title>I Am Error</title>
                </Helmet>
                <div className="errorHero">
                </div>
                <div className="errorContent">
                    <p>It seems you have a broken link or the page is missing. Wrap back to this web site's <Link to="/">homepage</Link>.</p>
                </div>
            </section>
		);
	}
}
