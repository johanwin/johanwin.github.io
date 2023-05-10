import React, { Component } from 'react';
import Header from './components/header';
import Footer from './components/footer';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ReactGA from 'react-ga';
import HomePage from './pages/HomePage';
import About from "./pages/About";
import Contact from './pages/Contact';
import ProjectsCapitalOne from "./pages/ProjectsCapitalOne";
import ProjectsIcrossing from "./pages/ProjectsIcrossing";
import ProjectsHawkeye from "./pages/ProjectsHawkeye";
import './App.css';

ReactGA.initialize('UA-61319727-1');
ReactGA.pageview(window.location.pathname + window.location.search);

function App() {
    return (
        <div className="App">
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="about/" element={<About />} />
              <Route path="contact/" element={<Contact />} />
              <Route path="projects/capitalone/" element={<ProjectsCapitalOne />} />
              <Route path="projects/icrossing/" element={<ProjectsIcrossing />} />
              <Route path="projects/hawkeye/" element={<ProjectsHawkeye />} />
            </Routes>
          </BrowserRouter>
          <Footer />
        </div>
    );
}

export default App;
