import React, { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { HashRouter, Route } from 'react-router-dom';
import { spring, AnimatedSwitch } from 'react-router-transition';
import ReactGA from 'react-ga';
import HomePage from './components/HomePage';
import About from './components/About';
import Contact from './components/Contact';
import Error from './components/Error';
import ProjectsCapitalOne from "./components/ProjectsCapitalOne";
import ProjectsIcrossing from "./components/ProjectsIcrossing";
import ProjectsHawkeye from "./components/ProjectsHawkeye";
import './App.css';

ReactGA.initialize('UA-61319727-1');
ReactGA.pageview(window.location.pathname + window.location.search);

function mapStyles(styles) {
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`,
  };
}

function bounce(val) {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  });
}

const bounceTransition = {
  atEnter: {
    opacity: 0,
    scale: 0.2,
  },
  atLeave: {
    opacity: bounce(1),
    scale: bounce(1),
  },
  atActive: {
    opacity: bounce(1),
    scale: bounce(1),
  },
};

export default class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
			projects: []
		};
  }
  componentDidMount() {
		fetch("http://johnnguyen.org/data/projects.json")
			.then(response => {
				return response.json();
			})
			.then(json => {
				this.setState({
					projects: json.slice(0, 7)
				});
			});
	}
  render() {
    return (
      <HashRouter>
        <div className="App">
          <Header />
            <AnimatedSwitch
            atEnter={bounceTransition.atEnter}
            atLeave={bounceTransition.atLeave}
            atActive={bounceTransition.atActive}
            mapStyles={mapStyles}
            className="switchWrapper"
          >
              <Route exact path="/" render={props => (
										<HomePage {...props} projects={this.state.projects} />
									)} />
              <Route path="/about/" component={About}/>
              <Route path="/contact/" component={Contact}/>
              <Route path="/projects/1" component={ProjectsCapitalOne}/>
              <Route path="/projects/2" component={ProjectsIcrossing}/>
              <Route path="/projects/3" component={ProjectsHawkeye}/>
              <Route component={Error} />
            </AnimatedSwitch>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}
