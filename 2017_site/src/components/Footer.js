import React from "react";

function Footer() {
		return (
            <footer className="footer" role="contentinfo">
                <small>Something something Copyright &copy; {(new Date().getFullYear())} John Nguyen</small>
            </footer>
		);
}

export default Footer;