import React, { Component } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import CustomFormControlLabel from '../theme/CustomFormControlLabel'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Button, Fa } from 'mdbreact';
import { Checkbox } from '@material-ui/core'

class LoginForm extends Component {

    constructor() {
        super();
        this.handleRemember = this.handleRemember.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            remember: false,
            userId: '',
            password: ''
        };
    }

    handleRemember = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleChange(event) {
        const b = event.target;
        this.setState({ [b.name]: b.value });
    }

    handleLogin(e) {
        console.log(e);
    }

    render() {
        return (
            <MuiThemeProvider>
            <ValidatorForm
                ref="form"
                onSubmit={this.handleLogin}
                onError={errors => console.log(errors)}
            >
                <Fa icon="user" />
                <TextValidator
                    id="userid"
                    floatingLabelText="User ID"
                    onChange={this.handleChange}
                    name="userid"
                    value={this.state.userid}
                    validators={['required']}
                    errorMessages={['This field is required']}
                />
                <TextValidator
                    id="password"
                    floatingLabelText="Password"
                    onChange={this.handleChange}
                    name="password"
                    value={this.state.password}
                    type="password"
                    icon={<Fa icon="lock" />}
                    validators={['required']}
                    errorMessages={['This field is required']}
                />
                <CustomFormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.remember}
                            onChange={this.handleRemember("remember")}
                            value="remember"
                            color="primary"
                            style={{ color: "whitesmoke" }}
                        />
                    }
                    label="Remember me"
                />
                <div className="text-right">
                    <Button type="submit">Sign Up</Button>
                </div>
            </ValidatorForm>
                </MuiThemeProvider>
        );
    }
}

export default LoginForm