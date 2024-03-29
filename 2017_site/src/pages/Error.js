import React from "react";
import {Helmet} from "react-helmet";
import { Link } from 'react-router-dom';

function Error() {
		return (
            <section className="error">
                <Helmet>
                    <title>I Am Error</title>
                </Helmet>
                <div className="errorHero">
                </div>
                <div className="errorContent">
                    <p>It seems you have a broken link or the page is missing. Warp back to this web site's <Link to="/">homepage</Link>.</p>
                </div>
            </section>
		);
}

export default Error;
