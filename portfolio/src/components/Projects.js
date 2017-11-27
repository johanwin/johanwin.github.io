import React, { Component } from 'react';
import {Helmet} from "react-helmet";

export default class Projects extends Component {
    constructor(props) {
		super(props);
		this.state = {
			project: {}
		};
	}
	componentDidMount() {
		if (this.props.projects.length) {
			this._renderProject(this.props.projects);
		}
	}
	componentWillReceiveProps(nextProps) {
		if (!this.props.projects.length && nextProps.projects.length) {
			this._renderProject(nextProps.projects);
		}
	}
	_renderProject(projects) {
		let project = projects.filter(p => {
			return (p.id = this.props.match.params.id);
		});
		if (project.length) {
			this.setState({ project: project[0] });
		}
    }
    render() {
        const { project: { title, body } } = this.state;
        return (
            <section className="project">
                <Helmet>
                    <title>{title && title}</title>
                    <meta name="description" content="This John Nguyen is a front-end web developer. He uses HTML, CSS, JavaScript, Angular, and R" />
                </Helmet>
                <div className="projectHero">
                    <div className="projectContent">
                        <h1>{title && title}</h1>
                        <p>{body && body}</p>
                    </div>
                    <div className="projectMedia">
                    </div>
                </div>
            </section>
        );
    }
}