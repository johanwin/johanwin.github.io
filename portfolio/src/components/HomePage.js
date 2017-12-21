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
	componentWillReceiveProps(nextProps) {
		if (!this.props.projects.length && nextProps.projects.length) {
			this._renderProjects(nextProps.projects);
		}
	}
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
                    <div className="homeDots homeDotsTopRight"></div>
                    <div className="homeDots homeDotsBottomRight"></div>
                    <div className="homeDots homeDotsBottomLeft"></div>
                    <div className="homeHeroContent">
                        <div className="headlineFake"><span className="headlineFakeManipulate">Cow</span>abunga</div>
                        
                        <p>A skillful Web User Experience (UX) Developer, who is a fast learner and radical dude.</p>

                        <Link to="/about" className="button buttonHome">Learn More About John</Link>
                    </div>
                </div>
                <div className="homeArticles">
                    <h1>Projects</h1>
                    <ul className="cards">
                        {this.state.projects.map((p, i) => {
                            return (
                                <li className="cardsItem" key={i}>
                                    <article className="card">
                                        <Link to={`/projects/${p.id}`} className={"cardImage " + (p.className)} role="presentation">
                                        </Link>
                                        <div className="cardContent">
                                            <div className="cardTitle"><Link to={`/projects/${p.id}`}>{p.title}</Link></div>
                                            <p className="cardText">{p.body}</p>
                                            <Link to={`/projects/${p.id}`} className="cardButton">View more.</Link>
                                        </div>
                                    </article>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>
        );
    }
}