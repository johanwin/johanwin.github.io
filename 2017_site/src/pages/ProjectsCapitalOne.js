import React, { useEffect } from "react";
import {Helmet} from "react-helmet";
import capitaloneDP1 from '../images/projects/capitalone-directportal1.png';
import capitaloneDP2 from '../images/projects/capitalone-directportal2.png';
import capitaloneDP3 from '../images/projects/capitalone-directportal3.png';
import capitalonePQ1 from '../images/projects/capitalone-prequal1.png';
import capitalonePQ2 from '../images/projects/capitalone-prequal2.png';
import capitalonePQ3 from '../images/projects/capitalone-prequal3.png';
import capitalonePQ4 from '../images/projects/capitalone-prequal4.png';

function ProjectsCapitalOne() {
        useEffect(() => {
            window.scrollTo(0, 0);
        }, []);
        return (
            <section className="project">
                <Helmet>
                    <title>2015 &ndash; 2017 Capital One Home Loans | John Nguyen</title>
                    <meta name="description" content="Created and kept up to date the code using Angular for Capital One's Home Loan website and applications." />
                </Helmet>
                <div className="projectContainer">
                    <div className="flexboxContainer">
                        <div className="projectContent">
                            <h1>2015 &ndash; 2017 Capital One Home Loans</h1>
                            <p>Responsible for developing and maintaining web page user interfaces for Capital One's Home Loan portal website and prequalification application with HTML, CSS/Sass, JavaScript/AngularJS 1.x.</p>

                            <p>Consult with backend/Java developers, UX/UI designers, business owners, and QA in terms of improving of Capital One's Home Loan web properties.</p>

                            <p>Maintained the internal Git version control's pull request for any web/UX design improvements and/or fixes on Home Loan pre-qualification code base.</p>

                            <ul>
                            <li>Created re-usable web components that are shared in multiple projects.</li>
                            <li>Increased the downloading performance of the web properties.</li>
                            <li>Integrated the frontend codebase with the company's enterprise-level content management system.</li>
                            <li>Unit testing the pre-qualification application. </li>
                            <li>Integrating WCAG’s web accessibility guidelines to apps.</li>
                            </ul>

                            <div className="projectMedia">
                                <h2>Home Loans website</h2>

                                    <img src={capitaloneDP1} alt="Capital One Home Loans Website" />
                                    <img src={capitaloneDP2} alt="Capital One Home Loans Website" />
                                    <img src={capitaloneDP3} alt="Capital One Home Loans Website" />


                                <h2>Home Mortgage Pre-Qualification Application</h2>


                                    <img src={capitalonePQ1} alt="Capital One Home Mortgage Prequalification" />
                                    <img src={capitalonePQ2} alt="Capital One Home Mortgage Prequalification" />
                                    <img src={capitalonePQ3} alt="Capital One Home Mortgage Prequalification" />
                                    <img src={capitalonePQ4} alt="Capital One Home Mortgage Prequalification" />

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
}

export default ProjectsCapitalOne;