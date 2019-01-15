import React, { Component } from 'react';
import { Container, Button, Header, Form, Segment, Divider, Input, Grid, GridColumn } from 'semantic-ui-react';
import LoginService from '../services/login'
import { notify } from '../services/notifications';
import { NotificationContainer } from 'react-notifications'


class LoginPage extends Component {

    constructor() {
        super()
        this.loginService = new LoginService()
    }

    state = {
        buttonColorCreateNew: "yellow",
        buttonColorSignIn: "orange",
        type: "signIn"
    }
    login = (username, password) => {
        const userCredentials = {
            username: username,
            password: password
        }
        if (this.state.type === "signIn") {
            this.loginService.signIn(userCredentials)
                .then(
                    data => {
                        this.props.history.push("/")
                        localStorage.setItem("user_id", data.data.user._id)
                        localStorage.setItem("user_name", data.data.user.name)
                        notify("success", `Welcome ${data.data.user.name}!`)
                    },
                ).catch(err => {
                    notify("error", err.response.data.error || err.message)
                })
        }
        else if (this.state.type === "createNew") {
            this.loginService.createUser(userCredentials)
                .then(
                    data => {
                        this.props.history.push("/")
                        localStorage.setItem("user_id", data.data.data.id)
                        localStorage.setItem("user_name", data.data.data.username)

                        notify("success", data.data.message, `Welcome ${data.data.data.username}!`)
                    },
                ).catch(err => {
                    notify("error", err.response.data.error || err.message)
                })
        }
    };

    selectSignIn = (type) => {
        this.setState({
            buttonColorSignIn: "orange",
            buttonColorCreateNew: "yellow",
            type: "signIn"
        })
    }

    selectLogIn = (type) => {
        this.setState({
            buttonColorSignIn: "yellow",
            buttonColorCreateNew: "orange",
            type: "createNew"
        })
    }

    render() {
        return (
            <Container text style={{ marginTop: "50px" }}>
                <Segment size="tiny" >
                    <Grid columns={3}>
                        <GridColumn>

                        </GridColumn>
                        <GridColumn>
                            <Header textAlign="center" size="large" >Welcome!

                        </Header>
                        </GridColumn>
                        <GridColumn textAlign="right">
                            <Button color={this.state.buttonColorSignIn} onClick={this.selectSignIn}>
                                Sign In
                            </Button >
                            <Button color={this.state.buttonColorCreateNew} onClick={this.selectLogIn}>
                                New User
                            </Button>
                        </GridColumn>
                    </Grid>
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
        if (this.state.passInputType === "password")
            this.setState({ passInputType: "text" })
        else
            this.setState({ passInputType: "password" })
    }
    render() {
        return (

            <Form onSubmit={this.handleSubmit.bind(this)} >

                <Form.Field>
                    <label basic >Username</label>
                    <Input
                        onChange={this.handleUserChange.bind(this)}
                        icon='user circle'
                        placeholder='Choose username'
                        value={this.state.username} />
                </Form.Field>
                <Form.Field>
                    <label basic>Password</label>
                    <Input
                        onChange={this.handlePasswordChange.bind(this)}
                        type={this.state.passInputType}
                        value={this.state.password}
                        placeholder='Choose password' >
                        <input />
                        <Button basic type="button" onClick={this.changePassType} icon="eye"></Button>

                    </Input>
                </Form.Field>

                <Segment textAlign="center" basic>
                    <Button color="blue" basic disabled={!this.state.username || !this.state.password}>

                        LOGIN
                </Button>

                </Segment>
            </Form>

        )
    }

}
