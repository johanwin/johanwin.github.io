import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import icrossingBCBST1 from '../images/projects/icrossing-bcbst1.jpg';
import icrossingBCBST2 from '../images/projects/icrossing-bcbst2.jpg';
import icrossingHilton1 from '../images/projects/icrossing-hilton1.jpg';
import icrossingMitsubishi11 from '../images/projects/icrossing-mitsubishi1.png';
export default class ProjectsIcrossing extends Component {
    componentDidMount () {
        window.scrollTo(0, 0)
    }
    render() {
        return (
            <section className="project">
                <Helmet>
                    <title>2012 &ndash; 2015 Client projects for iCrossing</title>
                </Helmet>
                <div className="projectContainer">
                    <div className="flexboxContainer">
                        <div className="projectContent">
                            <h1>2012 &ndash; 2015 Client projects for iCrossing</h1>
                            <p>Building websites for the agency's clients such as BlueCross BlueShield of Tennessee, MitsubishiCars.com, PNC Bank, Hilton Hotels, and Toyota.com.</p>
                            <div className="projectMedia">
                                <h2>BlueCross BlueShield of Tennessee website</h2>

                                <p>I worked with one of Tennessee's major health insurance companies, BlueCross BlueShield of Tennessee. In order to prepare for the Affordable Care Act, my team and I redesigned the company's site to incorporate the new healthcare laws. I was part of the team that was in charge of developing the desktop and mobile versions of the site, incorporating front-end web components to its corporate content management system, and helping to troubleshoot CSS or JavaScript bugs for the client.</p>

                                    <img src={icrossingBCBST1} alt="BlueCross BlueShield of Tennessee Website" />
                                    <img src={icrossingBCBST2} alt="BlueCross BlueShield of Tennessee Website" />

                                <h2>Hilton Hotels prototypes</h2>

                                <p>From HTML emails to Facebook app updates to one-page parallax scrolling web pages, I worked on a wide variety of projects for Hilton hotel brands.</p>

                                    <img src={icrossingHilton1} alt="Hilton Hotels prototype" />

                                <h2>Mitsubishi Motors website</h2>

                                <p>I was on the team that was responsible for maintaining and fixing CSS and JavaScript bugs for the Mitsubishi's responsive web design site. </p>

                                    <img src={icrossingMitsubishi11} alt="Mitsubishi Motors website" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}