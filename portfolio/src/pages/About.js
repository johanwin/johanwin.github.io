import React from 'react';
import {Helmet} from "react-helmet";
import resume from '../docs/john-nguyen-resume-cv.pdf';
import profilePic from '../images/john_nguyen.jpg';

function About() {
        return (
            <section className="about">
                <Helmet>
                    <title>About John Nguyen</title>
                    <meta name="description" content="This John Nguyen is a front-end web developer. He uses HTML, CSS, JavaScript, and React" />
                </Helmet>

                <div className="aboutHero">
                    <div className="aboutCircle"></div>
                    <div className="aboutHalfCircle"></div>
                    <div className="aboutCurvy"></div>
                    <div className="aboutCurvyUneven"></div>
                    <div className="headlineFake">
                        <span className="headlineFakeManipulate0">Who?</span>
                        <span className="headlineFakeManipulate1">What?</span>
                        <span className="headlineFakeManipulate2">Where?</span>
                        Nguyen!
                    </div>
                    <div className="wrapper aboutHeroContent">
                        <div className="flexboxContainer">
                            <article className="main">
                                <h1>About</h1>
                                <p>One of the many John Nguyens on the planet of Earth. Currently based in the Dallas - Ft. Worth, Texas area. I was raised in the 1980s and ’90s. Over a decade of experience working in the tech, advertising, and news media industries. I have worked on web-based projects with clients from small businesses to large, well-known international organizations.</p>


<p>I have a passion for creating visually stunning and intuitive user experiences, and have a strong foundation in HTML, CSS, and JavaScript. My expertise in React allows me to build efficient and scalable web applications that are easy to maintain and expand upon.</p>

<blockquote><p>Not only is [John] very knowledgeable in his field, he is easy to work with, diligent and consistently delivers high-quality work.</p></blockquote>
<p>I have worked on a variety of projects, ranging from small business websites to complex web applications for enterprise clients. No matter the size or scope of the project, I always strive to deliver high-quality work that meets the needs of my clients.</p>

<p>In my spare time, I enjoy staying up to date with the latest trends and technologies in the web development industry and participating in online coding challenges to hone my skills.</p>

<p>Thank you for visiting my portfolio. I hope you find my work and skills to be a good fit for your project needs. Feel free to contact me for more information or to discuss potential opportunities.</p>


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
                            </article>
                            <aside className="sidebar">
                                <img src={profilePic} alt="John Nguyen profile picture (p4p)" className="profilePic" />
                                <ul>
                                    <li><a href={resume} className="aboutLink aboutLinkResume" target="_blank">Résumé/CV</a></li>
                                    <li><a href="https://www.linkedin.com/in/johannguyen/" className="aboutLink aboutLinkLinkedin" target="_blank">Linkedin Profile</a></li>
                                    <li><a href="https://www.instagram.com/john_nguyen/" className="aboutLink  aboutLinkInstagram" target="_blank">Instagram Photos</a></li>
                                </ul>
                            </aside>
                        </div>

                    </div>
                </div>
            </section>
        );
    };
export default About;