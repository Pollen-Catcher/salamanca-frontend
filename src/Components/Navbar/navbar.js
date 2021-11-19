import React from 'react';
import "./navbar.css";
function Navbar(){
    return(
        <div className="Navbar"> 
            <div className="leftSide">
                <div className="links">
                    <a href="/home">Home</a>
                    <a href="/aboutCOMPET">About COMPET</a>
                    <a href="/contact">Contact</a>
                </div>
                <div className="signUp">
                    <a href="/signUp">Sign Up</a>
                </div>
            </div>
        </div>
    );
}

export default Navbar;