import React, { Component } from "react";
import {Helmet} from "react-helmet";

export default class ProjectItem extends Component {
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
                </Helmet>
                <div className="projectContainer">
                    <div className="projectContent">
                        <h1>{title && title}</h1>
                        <p>{body && body}</p>
                        <div className="projectMedia">
                        </div>
                    </div>
                </div>
			</section>
		);
	}
}
