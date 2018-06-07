import React, { Component } from 'react';
import CustomFormControlLabel from '../theme/CustomFormControlLabel'
import { Checkbox } from '@material-ui/core'
import { Input, Button } from 'mdbreact';
import Auth from '../util/auth';
import './login.css';

class LoginForm extends Component {

    constructor() {
        super();
        this.handleRemember = this.handleRemember.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.validField = this.validField.bind(this);
        this.state = {
            remember: false,
            userId: '',
            password: ''
        };
    }
    
    handleRemember = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleLogin(e) {
        e.preventDefault();
        const formData = Array.from(e.target.elements)
            .filter(el => el.id)
            .reduce((a, b) => ({ ...a, [b.id]: b.value }), {});

        fetch(process.env.REACT_APP_API_HOSTNAME + '/auth/login', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(formData)
        }).then((response) => response.json())
            .then(response => {
                if (response.success === false) {
                    response.message === "Incorrect User ID" ? 
                        this.setState({
                            userId: response.message
                        })
                    :
                        this.setState({
                            userId: '',
                            password: response.message
                        });
                }
                if (response.success) {
                    Auth.authenticateUser(response.token);
                    localStorage.removeItem('successMessage');
                    localStorage.setItem('loggedInUser', response.user.name)
                    this.props.toggle();
                }
                
            });
    }

    validField(field) {
        return this.state[field] === '' ? null : this.state[field] === "valid" ? "valid" : "invalid";
    }

    render() {
        return (
            <form onSubmit={this.handleLogin}>
                {localStorage.getItem('successMessage') && <p className="success-message">{localStorage.getItem('successMessage')}</p>}
                <Input id="userid" label="User ID" group icon="user" type="text" validate error={this.state.userId} required className={this.validField("userId")} />
                <Input id="password" label="Password" group icon="lock" type="password" validate error={this.state.password} required className={this.validField("password")} />
                <CustomFormControlLabel
                    control={
                        <Checkbox
                            checked={this.remember}
                            onChange={this.handleRemember("remember")}
                            value="remember"
                            color="primary"
                            style={{ color: "whitesmoke" }}
                        />
                    }
                    label="Remember me"
                />
                <div className="text-right">
                    <Button type="submit">Login</Button>
                </div>
            </form>
        );
    }
}

export default LoginForm