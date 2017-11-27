import React, { Component } from "react";
import {Helmet} from "react-helmet";
import { Link } from 'react-router-dom'
import resume from '..//docs/john-nguyen-resume-cv.pdf';
import profilePic from '../images/john_nguyen.jpg';

export default class About extends Component {
    render() {
        return (
            <section className="about">
                <Helmet>
                    <title>About John Nguyen</title>
                    <meta name="description" content="This John Nguyen is a front-end web developer. He uses HTML, CSS, JavaScript, Angular, and R" />
                </Helmet>
                <div className="aboutHero">
                    <div className="headlineFake">
                        <span className="headlineFakeManipulate0">Who?</span> 
                        <span className="headlineFakeManipulate1">What?</span> 
                        <span className="headlineFakeManipulate2">Where?</span> 
                        Nguyen!
                    </div>
                    <div className="aboutHeroContent">
                        <div className="flexboxContainer">
                            <article className="main">
                                <h1>About</h1>
                                <p>One of the many John Nguyens on the planet of Earth. Currently based in the Dallas - Ft. Worth, Texas area. I was raised in the 1980s and ’90s. Over a decade of experience working in the tech, advertising, and news media industries. I have worked on web-based projects with clients from small businesses to large, well-known international organizations.</p>
                                <blockquote><p>Not only is [John] very knowledgeable in his field, he is easy to work with, diligent and consistently delivers high-quality work.</p></blockquote>
                                <p>I do have are a very particular set of skills; skills I have acquired over a very long career. Skills that make me a dream for people like you. My skills include:</p>
                                <div className="flexTableContainer">
                                    <div className="flexItem">
                                    <ul className="package">
                                        <li className="header">Layout</li>
                                        <li>HTML</li>
                                        <li>CSS/Sass</li>
                                        <li>Accessibility</li>
                                        <li><abbr title="Search Engine Optimization">SEO</abbr></li>
                                    </ul>
                                    </div>
                                    <div className="flexItem">
                                    <ul className="package">
                                        <li className="header">Develop</li>  
                                        <li>JavaScript</li>
                                        <li>AngularJS/Angular</li>
                                        <li>React</li>
                                        <li>Git</li>
                                    </ul>
                                    </div>
                                    <div className="flexItem">
                                    <ul className="package">
                                        <li className="header">Visual</li>
                                        <li>Sketch</li>
                                        <li>Photoshop</li>
                                        <li>Illustrator</li>
                                    </ul>
                                    </div>
                                </div>
                                <p>Take a peek at <Link to="/">my past work</Link>. Then give me <Link to="/contact">a holla</Link>.</p>
                            </article>
                            <aside className="sidebar">
                                <img src={profilePic} alt="John Nguyen" className="profilePic" />
                                <ul>
                                    <li><a href={resume} className="aboutLink aboutLinkResume">Résumé/CV</a></li>
                                    <li><a href="https://www.linkedin.com/in/johannguyen/" className="aboutLink aboutLinkLinkedin">Linkedin Profile</a></li>
                                    <li><a href="https://www.instagram.com/john_nguyen/" className="aboutLink  aboutLinkInstagram">Instagram Photos</a></li>
                                </ul>
                            </aside>  
                        </div>
                        
                    </div>
                </div>
            </section>
        );
    }
}