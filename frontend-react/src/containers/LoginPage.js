import React, { Component } from 'react';
import { Container, Button, Header, Form, Segment, Divider, Input, Grid, GridColumn, Icon, Label } from 'semantic-ui-react';
import { Route, Redirect, withRouter } from 'react-router';
import LoginService from '../services/login'
import { notify } from '../services/notifications';
import { NotificationContainer } from 'react-notifications'


class LoginPage extends Component {

    constructor() {
        super()
        this.LoginService = new LoginService()
    }
    login = (username, password) => {
        const userCredentials = {
            username: username,
            password: password
        }

        this.LoginService.login(userCredentials)
            .then(
                data => {
                    this.props.history.push("/")
                    notify("success", data.message)
                },
            ).catch(err => {
                notify("error", err.response.data.error)
            })
    };
    render() {
        return (
            <Container text style={{ marginTop: "50px" }}>
                <Segment size="tiny" padded textAlign="center">
                    <Header size="large" >LOGIN</Header>
                    <Divider></Divider>
                    <LoginForm login={this.login}></LoginForm>
                </Segment>
                <NotificationContainer></NotificationContainer>
            </Container>
        );
    }
}

export default LoginPage;
class LoginForm extends Component {

    state = {
        username: "",
        password: "",
        passInputType: "password"
    }


    handleUserChange = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    handleSubmit = () => {
        this.props.login(this.state.username, this.state.password)
    }

    changePassType = () => {
        if (this.state.passInputType == "password")
            this.setState({ passInputType: "text" })
        else
            this.setState({ passInputType: "password" })
    }
    render() {
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} >

                <Form.Field>
                    <Input
                        label={{ basic: true, content: "Username" }}
                        onChange={this.handleUserChange.bind(this)}
                        icon='user circle'
                        placeholder='Choose username'
                        value={this.state.username} />
                </Form.Field>
                <Form.Field>
                    <Input
                        label
                        onChange={this.handlePasswordChange.bind(this)}
                        type={this.state.passInputType}
                        value={this.state.password}
                        placeholder='Choose password' >
                        <Label basic position="left">Password</Label>
                        <input />
                        <Button type="button" onClick={this.changePassType} icon="eye"></Button>

                    </Input>
                </Form.Field>

                <Segment basic>
                    <Button color="blue" basic disabled={!this.state.username || !this.state.password}>

                        LOGIN
                </Button>

                </Segment>
            </Form>
        )
    }

}
