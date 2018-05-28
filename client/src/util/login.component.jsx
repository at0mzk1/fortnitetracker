import React, { Component } from 'react';
import CustomFormControlLabel from '../theme/CustomFormControlLabel'
import { Checkbox } from '@material-ui/core'
import { Input, Button } from 'mdbreact';
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
        console.log(e);
    }

    validField(field) {
        return this.state[field] === '' ? null : this.state[field] === "valid" ? "valid" : "invalid";
    }

    render() {
        return (
            <form onSubmit={this.handleLogin}>
                <Input id="userid" label="User ID" group icon="user" type="text" validate error={this.state.userId} required className={this.validField("userId")} />
                <Input id="password" label="Password" group icon="lock" type="password" validate required className={this.validField("password")} />
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