import React, { Component } from 'react';
import { Modal, Button, Nav, NavItem, FormGroup, Col, Checkbox, Form, ControlLabel, FormControl, Grid, Row } from 'react-bootstrap';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import validate from '../util/validator.js';
import './modal.css';

//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 500;  //time in ms (5 seconds)
class MyLargeModal extends Component {

    constructor() {
        super();
        this.render.bind(this);
        this.state = {
            action: "Login",
            activeKey: 1,
            userId: null,
            password: null,
            emailAddress: null,
            isDisabled: true
        };
    }

    handleSelect(eventKey) {
        this.setState({
            activeKey: eventKey
        });
    }

    getValidationState(field) {
        return this.state[field];
    }

    handleFormSubmit() {
        if (this.state.userId === "success" && this.state.password === "success" && this.state.emailAddress === "success")
        this.setState({isDisabled: false});
    }

    //on keyup, start the countdown
    keyup(e) {
        let eventId = e.target.id;
        let eventVal = e.target.value;
        let that = this;
        clearTimeout(typingTimer);
        if (e.target.value) {
            typingTimer = setTimeout(() => {
                if(eventId === "confirmPassword")
                    that.setState({ [document.getElementById("password").id] : validate(eventId, eventVal, document.getElementById("password").value)});
                else if (eventId === "emailAddress") {
                    that.setState({ [eventId]: validate(eventId, eventVal) });
                    that.handleFormSubmit();
                }
                else
                    that.setState({[eventId]: validate(eventId, eventVal)});
            }, doneTypingInterval);
        }
    }

    createUser(e) {
        const formData = Array.from(e.target.elements)
            .filter(el => el.name)
            .reduce((a, b) => ({ ...a, [b.name]: b.value }), {});
        //https://long-drink.glitch.me/user
        fetch('http://localhost:5000/user', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(formData)
        });

        e.preventDefault();
    }

    render() {
        return (
            <Modal
                show={this.props.show} 
                onHide={this.props.onHide}
                onSelect={this.props.onSelect}
                bsSize="small"
            >
                <Modal.Header closeButton>
                    <Nav bsStyle='pills' activeKey={this.state.activeKey} onSelect={this.handleSelect.bind(this)} className="login-nav-tab">
                        <NavItem eventKey={1} title="Item"><span>Log In</span></NavItem>
                        <NavItem eventKey={2} title="Item"><span>Sign Up</span></NavItem>
                    </Nav>
                </Modal.Header>
                <Modal.Body>
                    {this.state.activeKey === 1 ? <LoginForm /> : <SignUpForm isDisabled={this.state.isDisabled} getValidationState={this.getValidationState.bind(this)} validateForm={this.createUser} keyup={this.keyup.bind(this)}/>}
                </Modal.Body>
                <Modal.Footer>
                    <Grid fluid={true}>
                        <Row>
                            <FormGroup className="formgroup-centered">
                        <ControlLabel>OR</ControlLabel>
                        <FormControl.Static>Sign in with social account</FormControl.Static>
                    </FormGroup>
                        </Row>
                        <Row>
                            <Col sm={6} className="formgroup-centered" >
                                <GoogleLogin
                                    clientId="669816818644-kk374gvqb31g9sc0ehoqlgcg81452dbh.apps.googleusercontent.com"
                                    buttonText="Google"
                                    onSuccess={responseGoogle}
                                    onFailure={responseGoogle}
                                    className="google-login"
                                />
                                </Col>
                            <Col sm={6} className="formgroup-centered" >
                                <FacebookLogin
                                    appId="1088597931155576"
                                    autoLoad={true}
                                    fields="name,email,picture"
                                    callback={responseFacebook}
                                    textButton="Facebook"
                                    cssClass="facebook-login"
                                />
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }

}

const responseGoogle = (response) => {
    if(response.profileObj){
    console.log(response);
    }
    else
    console.log("Error autheticating with Google.");
}

const responseFacebook = (response) => {
    console.log(response);
}

const LoginForm = (props) => {
    return (
        <Form>
            <FormControl
                id="userId"
                type="text"
                placeholder="User ID"
            />
            <FormControl
                id="password"
                type="password"
                placeholder="Password"
            />
            <Checkbox>
                Remember Me
            </Checkbox>
            <Button type="submit">Login</Button>
        </Form>
    );
}

const SignUpForm = (props) => {
    return (
        <div>
            <Form onSubmit={props.validateForm}>
                <FormGroup
                    validationState={props.getValidationState("userId")}
                >
                    <FormControl
                        id="userId"
                        name="userId"
                        type="text"
                        placeholder="User ID"
                        onKeyUp={props.keyup}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                    validationState={props.getValidationState("password")}
                >
                    <FormControl
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                    <FormControl
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        onKeyUp={props.keyup}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                    validationState={props.getValidationState("emailAddress")}
                >
                    <FormControl
                        id="emailAddress"
                        name="emailAddress"
                        type="email"
                        placeholder="Email"
                        onKeyUp={props.keyup}
                    />
                </FormGroup>
                <FormControl.Feedback />
                <Button type="submit" 
                disabled={props.isDisabled}
                >Create Account</Button>
            </Form>
        </div>
    );
}

export default MyLargeModal;