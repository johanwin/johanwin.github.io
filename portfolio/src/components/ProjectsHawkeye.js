import React from 'react';
import {Helmet} from "react-helmet";
import hawkeyeTK1 from '../images/projects/hawkeye-tk1.png';
import hawkeyeAgency1 from '../images/projects/hawkeye-agency1.png';
import hawkeyeAgency2 from '../images/projects/hawkeye-agency2.png';

class ProjectsHawkeye extends React.Component {
    componentDidMount () {
        window.scrollTo(0, 0)
    }
    render() {
        return (
            <section className="project">
                <Helmet>
                    <title>2008 &ndash; 2012 Client projects for Publicis Hawkeye</title>
                </Helmet>
                <div className="projectContainer">
                    <div className="flexboxContainer">
                        <div className="projectContent">
                            <h1>2008 &ndash; 2012 Client projects for Publicis Hawkeye</h1>
                            <p>Creating websites and emails for clients such as ThyssenKrupp Elevator, Travelocity, Capital One, Cablevision, The North Face, Alltel, Agilent, The Dallas Morning News, Sony, and Raising Cane's.</p>
                            <div className="projectMedia">
                                <h2>ThyssenKrupp Elevator website</h2>
                                <p>I was one of the lead front-end developers for the major elevator company's redesign website. I helped lead the development of the static web pages.</p>

                                <img src={hawkeyeTK1} alt="ThyssenKrupp Elevator" />

                                <h2>hawkeye Agency website</h2>

                                <img src={hawkeyeAgency1} alt="hawkeye Agency website" />
                                <img src={hawkeyeAgency2} alt="hawkeye Agency website" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default ProjectsHawkeye;