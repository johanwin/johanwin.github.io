import React, { Component } from "react";
import {Helmet} from "react-helmet";

export default class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _replyto: '',
            body: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        e.target.classList.add('active');

        this.setState({
            [e.target.name]: e.target.value
        });

        this.showInputError(e.target.name);
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.showFormErrors()) {
            console.log('form is invalid: do not submit');
        } else {
            console.log('form is valid: submit');
        }
    }

    showFormErrors() {
        const inputs = document.querySelectorAll('input');
        let isFormValid = true;

        inputs.forEach(input => {
            input.classList.add('active');

            const isInputValid = this.showInputError(input.name);

            if (!isInputValid) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    showInputError(refName) {
        const validity = this.refs[refName].validity;
        const error = document.getElementById(`${refName}Error`);

        if (!validity.valid) {
            if (validity.valueMissing) {
                error.textContent = ` is a required field`;
            } else if (validity.typeMismatch) {
                error.textContent = ` should be a valid email address`;
            }
            return false;
        }

        error.textContent = '';
        return true;
    }
    render() {
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
                            <form action="http://formspree.io/whatsup@johnnguyen.org" method="POST" noValidate>
                                <legend>Please feel free to contact me via email <a href="mailto:whatsup@johnnguyen.org">whatsup@johnnguyen.org</a>. You could also use the following form:</legend>
                                <div className="form-group">
                                    <input className="form-control"
                                    type="email"
                                    name="_replyto"
                                    ref="_replyto"
                                    value={ this.state._replyto } 
                                    onChange={ this.handleChange }
                                    required />
                                    <label id="_replytoLabel" htmlFor="_replyto">Email <span className="error" id="_replytoError" /></label>
                                </div>
                                <div className="form-group">
                                    <textarea name="body" ref="body" value={ this.state.body } onChange={ this.handleChange } required></textarea>
                                    <label id="bodyLabel" htmlFor="body">Message <span className="error" id="bodyError" /></label>
                                </div>
                                <input type="submit" value="Send Message" disabled={!this.state._replyto || !this.state.body} />
                            </form>
                        </article>  
                    </div>
                </div>
            </section>
        );
    }
}