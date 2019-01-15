import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import Navigation from '../components/Navigation';
import { NavigationRoutes } from '../routes'
import { NotificationContainer } from 'react-notifications'

class App extends Component {
    render() {
        return (
            <Container>
                <Navigation></Navigation>
                <NavigationRoutes></NavigationRoutes>
                <NotificationContainer />
            </Container>
        );
    }
}
//@ts-ignore
export default App
