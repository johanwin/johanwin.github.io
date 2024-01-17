import React, { useEffect } from "react";
import {Helmet} from "react-helmet";
import hawkeyeTK1 from '../images/projects/hawkeye-tk1.png';
import hawkeyeAgency1 from '../images/projects/hawkeye-agency1.png';
import hawkeyeAgency2 from '../images/projects/hawkeye-agency2.png';

function ProjectsHawkeye() {
        useEffect(() => {
            window.scrollTo(0, 0);
        }, []);
        return (
            <section className="project">
                <Helmet>
                    <title>2008 &ndash; 2012 Client projects for Hawkeye | John Nguyen</title>
                    <meta name="description" content="Creating websites & emails for clients such as ThyssenKrupp Elevator and Raising Cane’s." />
                    <link rel="canonical" href="https://johnnguyen.org/projects/hawkeye" />
                </Helmet>
                <div className="projectContainer">
                    <div className="flexboxContainer">
                        <div className="projectContent">
                            <h1>2008 &ndash; 2012 Client projects for Hawkeye</h1>
                            <p>Creating websites and emails for clients such as ThyssenKrupp Elevator, Travelocity, Capital One, Cablevision, The North Face, Alltel, Agilent, The Dallas Morning News, Sony, and Raising Cane's.</p>
                            <ul>
                            <li>Worked with multiple art directors and UI designers to make sure their ideas and visions are well implemented in the final result.</li>
                            <li>Implemented the development of the agency’s new website.</li>
                            <li>Built websites, landing pages, and HTML emails in a rapid and quality pace.</li>
                            </ul>
                            <div className="projectMedia">
                                <h2>ThyssenKrupp Elevator website</h2>
                                <p>I was one of the lead front-end developers for the major elevator company's redesign website. I helped lead the development of the static web pages.</p>

                                    <img src={hawkeyeTK1} alt="ThyssenKrupp Elevator designer" />

                                <h2>hawkeye Agency website</h2>

                                <p>Back in early 2010s, the agency replaced their Adobe Flash-powered website with one that pulls postings from their employees' professional social media accounts. I was assigned to be the main developer to code its layout and customized the content management system's functionality.</p>

                                    <img src={hawkeyeAgency1} alt="hawkeye Agency website" />
                                    <img src={hawkeyeAgency2} alt="hawkeye Agency website" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
}

export default ProjectsHawkeye;