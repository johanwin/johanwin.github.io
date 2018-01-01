import React, { Component } from 'react';
// import configureStore from './store/configureStore';
// import {loadProjects} from './actions/projectActions';
// import {Provider} from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import { HashRouter, Route } from 'react-router-dom';
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
              <Route exact path="/" render={props => (
                    <HomePage {...props} projects={this.state.projects} />
                  )} />
              <Route path="/about/" component={About}/>
              <Route path="/contact/" component={Contact}/>
              <Route path="/projects/1" component={ProjectsCapitalOne}/>
              <Route path="/projects/2" component={ProjectsIcrossing}/>
              <Route path="/projects/3" component={ProjectsHawkeye}/>
              <Route component={Error} />
          <Footer />
        </div>
      </HashRouter>
    );
  }
}
