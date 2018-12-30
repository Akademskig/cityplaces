import React, { Component } from 'react';
import { Container, Button, Header, Form } from 'semantic-ui-react';
import { Route, Redirect, withRouter } from 'react-router';



class LoginPage extends Component {

    login = () => {
        //@ts-ignore
        this.props.history.push("/")
    };
    render() {
        return (
            <Container>
                <Header>Login page</Header>
                <Button onClick={this.login} color="purple">Login</Button>
            </Container>
        );
    }
}

export default LoginPage;
