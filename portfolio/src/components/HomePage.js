import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import { Link } from 'react-router-dom'

export default class HomePage extends Component {
    constructor(props) {
		super(props);
		this.state = {
			projects: []
		};
    }
    
	componentDidMount() {
        this._renderProjects(this.props.projects);
	}
	// componentWillReceiveProps(nextProps) {
	// 	if (!this.props.projects.length && nextProps.projects.length) {
	// 		this._renderProjects(nextProps.projects);
	// 	}
	// }
	_renderProjects(projects) {
		this.setState(
			{
				projects: projects
			}
		);
    }

    render() {
        return (
            <section className="home">
                <Helmet>
                    <title>Web Projects by John Nguyen</title>
                    <meta name="description" content="John builds projects using up-to-date workflows, technologies, and standards to make faster, better, and well-designed sites; finding solutions that last." />
                </Helmet>
                <div className="homeHero">
                    <div className="homeHeroContent">
                        <div className="headlineFake"><span className="headlineFakeManipulate">Cow</span>abunga</div>
                        
                        <p>A skillful Web User Experience (UX) Developer, who is a fast learner and radical dude.</p>

                        <Link to="/about" className="button buttonHome">Learn More About John</Link>
                    </div>
                </div>
                <div className="homeArticles">
                    <h1>Projects</h1>
                    <ul className="cards">
                        <Test />
                        <li className="cardsItem">
                            <article className="card">
                                <Link to="/projects/1" className="cardImage cardImageCapitalOne"></Link>
                                <div className="cardContent">
                                    <div className="cardTitle"><Link to="/projects/1">2015 &ndash; 2017: Capital One</Link></div>
                                    <p className="cardText">Responsible for developing and maintaining web user interfaces for Capital One's Home Loans.</p>
                                    <Link to="/projects/1" className="cardButton">View more.</Link>
                                </div>
                            </article>
                        </li>
                        <li className="cardsItem">
                            <article className="card">
                                <Link to="/projects/2" className="cardImage cardImageIcrossing"></Link>
                                <div className="cardContent">
                                    <div className="cardTitle"><Link to="/projects/2">2012 &ndash; 2015: iCrossing</Link></div>
                                    <p className="cardText">Building websites for the agency's clients such as BlueCross BlueShield of Tennessee and Mitsubishi Motors.</p>
                                    <Link to="/projects/2" className="cardButton">View more.</Link>
                                </div>
                            </article>
                        </li>
                        <li className="cardsItem">
                            <article className="card">
                                <Link to="/projects/3" className="cardImage cardImageHawkeye"></Link>
                                <div className="cardContent">
                                    <div className="cardTitle"><Link to="/projects/3">2008 &ndash; 2012: Publicis Hawkeye</Link></div>
                                    <p className="cardText">Developed web designs for clients such as ThyssenKrupp Elevator and Raising Cane's.</p>
                                    <Link to="/projects/3" className="cardButton">View more.</Link>
                                </div>
                            </article>
                        </li>
                    </ul>
                </div>
            </section>
        );
    }
}

class Test extends React.Component {    
    render() {
      return (
        <div>
            {/* {this.props.projects.map((p, i) => {
                return (
                    <li key={i}>
                        <Link to={`/projects/${p.id}`}>
                            {p.title}
                        </Link>
                    </li>
                );
            })} */}
        </div>
      );
    }
  }