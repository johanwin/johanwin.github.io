import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import ReactGA from 'react-ga';
import HomePage from './pages/HomePage';
import Error from './pages/Error';
import About from "./pages/About";
import Contact from './pages/Contact';
import ProjectsCapitalOne from "./pages/ProjectsCapitalOne";
import ProjectsIcrossing from "./pages/ProjectsIcrossing";
import ProjectsHawkeye from "./pages/ProjectsHawkeye";
import './App.css';

ReactGA.initialize('G-4H2DVN8V8K');
ReactGA.pageview(window.location.pathname + window.location.search);

function App() {
    return (
        <div className="App">
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path='*' element={<Error />} />
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
