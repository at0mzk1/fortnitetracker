import React, { Component } from 'react';
import { Container, Card, CardBody, CardTitle, Col, Row } from 'mdbreact';
import api from '../util/api';
import './forgotpassword.css';

class PasswordReset extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
            return (this.props.action === "reset" ? forgotPassword() : resetPassword());
    }
}

const forgotPassword = () => {

}

const resetPassword = () => {
    
}

export default PasswordReset;