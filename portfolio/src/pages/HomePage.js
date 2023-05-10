import React from "react";
import {Helmet} from "react-helmet";
import { Link } from 'react-router-dom';
import ProjectItem from "../components/projectItem";

function HomePage() {
        return (
            <section className="home">
                <Helmet>
                    <title>John Nguyen, User Interface (UI) Engineer</title>
                    <meta name="description" content="John builds projects using up-to-date workflows, technologies, and standards to make faster, better, and well-designed sites; finding solutions that last." />
                </Helmet>
                <div className="homeHero">
                    <div className="homeDots homeDotsTopRight"></div>
                    <div className="homeDots homeDotsBottomRight"></div>
                    <div className="homeDots homeDotsBottomLeft"></div>
                    <div className="homeHeroContent">
                        <div className="headlineFake"><span className="headlineFakeManipulate">Cow</span>abunga</div>

                        <p>A skillful web-based User Interface (UI) Developer, who is a fast learner and radical dude.</p>

                        <Link to="/about" className="button buttonHome">Learn More About John</Link>
                    </div>
                </div>
                <div className="homeArticles">
                    <h1>Projects</h1>
                    <ul className="cards">
                        <ProjectItem name="capitalone" title="2015 - 2017 Capital One Home Loans" description="Responsible for developing and maintaining web user interfaces for Capital One's Home Loans." />
                        <ProjectItem name="icrossing" title="2012 - 2015 Client projects for iCrossing" description="Building websites for the agency's clients such as BlueCross BlueShield of Tennessee and Mitsubishi Motors." />
                        <ProjectItem name="hawkeye" title="2008 - 2012 Client projects for Hawkeye" description="Developed web designs for clients such as ThyssenKrupp Elevator and Raising Cane's." />
                    </ul>
                </div>
            </section>
        );
}

export default HomePage;