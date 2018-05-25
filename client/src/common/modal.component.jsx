import React, { Component } from 'react';
import { Container, Modal, ModalFooter, Fa, Row, Col } from 'mdbreact';
import { Tabs, Typography, } from '@material-ui/core'
import CustomTab from '../theme/CustomTab'
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import SignUpForm from '../util/signup.component'
import LoginForm from '../util/login.component'
import './modal.css';

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3, color: "whitesmoke" }}>
            {children}
        </Typography>
    );
}

class MyLargeModal extends Component {

    constructor() {
        super();
        this.render.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            remember: false,
            value: 0,
            modal: false
        };
    }

    handleChange = (event, value) => {
        event.preventDefault();
        this.setState({ value });
    };

    render() {
        return (
            <Container>
                <Modal isOpen={this.props.show} toggle={this.props.toggle} centered>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                    >
                        <CustomTab label="Log In" icon={<Fa icon="user" />}/>
                        <CustomTab label="Sign Up" icon={<Fa icon="user-plus" />}/>
                    </Tabs>
                    {this.state.value === 0 && <TabContainer><LoginForm /></TabContainer>}
                    {this.state.value === 1 && <TabContainer><SignUpForm /></TabContainer>}
                    <ModalFooter>
                        <Container fluid>
                            <Row>
                                <Col sm='12'>
                                    <h6 className="text-center">OR</h6>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm='12'>
                                    <h5 className="text-center">Sign in with social account</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm='6' className="formgroup-centered" >
                                    <GoogleLogin
                                        clientId="669816818644-kk374gvqb31g9sc0ehoqlgcg81452dbh.apps.googleusercontent.com"
                                        buttonText="Google"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                        className="google-login"
                                    />
                                </Col>
                                <Col sm='6' className="formgroup-centered" >
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
                        </Container>
                    </ModalFooter>
                </Modal>
            </Container>
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

export default MyLargeModal;