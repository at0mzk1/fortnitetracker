import React, { Component } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Button, Fa } from 'mdbreact';

class SignUpForm extends Component {

    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            userId: '',
            password: '',
            confirmPassword: '',
            email: '',
            err: ''
        };
    }

    componentWillMount() {
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });
    }

    createUser(e) {
        // validate(e);
        // //https://long-drink.glitch.me/user
        // fetch('http://localhost:5000/auth/signup', {
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     method: 'POST',
        //     body: JSON.stringify(formData)
        // }).then((response) => response.json())
        //     .then(response => {
        //     console.log(response);
        //     });

        e.preventDefault();
    }

    handleChange(event) {
        const b = event.target;
        this.setState({ [b.name]: b.value });
    }
    
    render() {
        return (
            <MuiThemeProvider>
            <ValidatorForm
                ref="form"
                onSubmit={this.createUser}
                onError={errors => console.log(errors)}
            >
                <TextValidator
                    id="userid"
                    floatingLabelText="User ID"
                    onChange={this.handleChange}
                    name="userid"
                    value={this.state.userid}
                    icon={<Fa icon="user" />}
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
                <TextValidator
                    id="confirmPassword"
                    floatingLabelText="Confirm Password"
                    onChange={this.handleChange}
                    name="confirmPassword"
                    value={this.state.confirmPassword}
                    type="password"
                    icon={<Fa icon="lock" />}
                    validators={['isPasswordMatch', 'required']}
                    errorMessages={['Password and Confirm Password must be equal', 'This field is required']}
                />
                <TextValidator
                    id="email"
                    floatingLabelText="Email"
                    onChange={this.handleChange}
                    name="email"
                    value={this.state.email}
                    icon={<Fa icon="envelope" />}
                    validators={['required', 'isEmail']}
                    errorMessages={['This field is required', 'Email is not valid']}
                />
                <div className="text-right">
                    <Button type="submit">Sign Up</Button>
                </div>
            </ValidatorForm>
                </MuiThemeProvider>
        );
    }
}

export default SignUpForm