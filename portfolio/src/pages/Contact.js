import React from 'react';
import {Helmet} from "react-helmet";

function Contact() {
        return (
            <section className="contact">
                <Helmet>
                    <title>Contact John Nguyen</title>
                    <meta name="description" content="Discuss a web project with John Nguyen." />
                    <link rel="canonical" href="https://johnnguyen.org/contact/" />
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
                            <p>If you have an exciting project in mind and you're seeking an experienced user interface engineer to bring it to life, you've come to the right place. I've have a proven track record of delivering intuitive and visually appealing interfaces that delight users.</p>
                            <p>Are you excited about user interfaces as much as me? Do you have a project idea, a question, or just want to say hello? I would be delighted to connect with you! Feel free to reach out me via email <a href="mailto:whatsup@johnnguyen.org">whatsup@johnnguyen.org</a>.</p>
                        </article>
                    </div>
                </div>
            </section>
        );
}
export default Contact;