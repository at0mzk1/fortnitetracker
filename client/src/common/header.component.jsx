import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink } from 'mdbreact';
import Auth from '../util/auth';
import './header.css';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
            active: "Home"
        };
        this.onClick = this.onClick.bind(this);
        
    }

    handleMenuClick(menu) {
        this.setState({
            active: menu,
        });
    }

    onClick() {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    render() {
        return (
            <div className="header">
                <Navbar color="elegant-color" dark expand="lg" scrolling>
                        <NavbarBrand href="/" tag="span">
                            <strong>Fortnite Friends Rankings <small>created by at0mz</small></strong>
                        </NavbarBrand>
                    {!this.state.isWideEnough && <NavbarToggler onClick={this.onClick}/>}
                        <Collapse isOpen={this.state.collapse} navbar>
                            <NavbarNav left>
                            <NavItem className={window.location.pathname === "/" ? 'active' : ''}>
                                <NavLink to="/" onClick={() => this.handleMenuClick("Home")}>Home</NavLink>
                            </NavItem>
                            <NavItem className={window.location.pathname === "/tracker" ? 'active' : ''}>
                                <NavLink to="/tracker" onClick={() => this.handleMenuClick("Tracker")}>Tracker</NavLink>
                            </NavItem>
                            </NavbarNav>
                            <NavbarNav right>
                            {Auth.isUserAuthenticated() ? <NavItem className="loggedInUser">Welcome{", "}<NavLink to="/profile" >{localStorage.getItem('loggedInUser')}</NavLink>{" "}</NavItem> : null}
                            <NavItem>
                                { Auth.isUserAuthenticated() ? <NavLink to="/logout" >Logout</NavLink> : <NavLink to="#" onClick={() => this.props.toggleModal()}>Login</NavLink>}
                            </NavItem>
                            </NavbarNav>
                        </Collapse>
                    </Navbar>
                
            </div>
        );
    }
}

export default Header;