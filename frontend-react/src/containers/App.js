import React, { Component } from 'react';
import "semantic-ui-css/semantic.min.css"
import { Container } from 'semantic-ui-react';
import Navigation from '../components/Navigation';
import { NavigationRoutes } from '../routes'
import { withRouter } from 'react-router';


class App extends Component {
    render() {
        return (
            <Container>
                <Navigation></Navigation>
                <NavigationRoutes></NavigationRoutes>
            </Container>
        );
    }
}
//@ts-ignore
export default App
