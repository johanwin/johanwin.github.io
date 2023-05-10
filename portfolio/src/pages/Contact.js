import React from 'react';
import {Helmet} from "react-helmet";

function Contact() {
        return (
            <section className="contact">
                <Helmet>
                    <title>Contact John Nguyen</title>
                    <meta name="description" content="Let's discuss a web project." />
                </Helmet>
                <div className="contactHero">
                    <div className="flexboxContainer">
                        <aside className="sidebar">
                            <div className="headlineFake">
                                <span>Hello?</span> Is it me you're looking for?
                            </div>
                        </aside>
                        <article className="main">
                            <h1>Contact</h1>
                            <p>Are you excited about user interfaces as much as  me? Do you have a project idea, a question, or just want to say hello? I would be delighted to connect with you! Feel free to reach out me via email <a href="mailto:whatsup@johnnguyen.org">whatsup@johnnguyen.org</a>.</p>
                        </article>
                    </div>
                </div>
            </section>
        );
}
export default Contact;