import React from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

const ProjectItem = (props) => {
		return (
		<li className="cardsItem">
			<div className="card">
				<Link to={`/projects/${props.name}`} className={`cardImage ${props.name}`} role="presentation">
				</Link>
				<div className="cardContent">
					<h2 className="cardTitle"><Link to={`/projects/${props.name}`}>{props.title}</Link></h2>
					<p className="cardText">{props.description}</p>
					<Link to={`/projects/${props.name}`} className="cardButton">View more.</Link>
				</div>
			</div>
		</li>
		);
}

ProjectItem.propTypes = {
	name: PropTypes.string,
	title: PropTypes.string,
	description: PropTypes.string
}

export default ProjectItem;

