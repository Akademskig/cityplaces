import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import Navigation from '../components/Navigation';
import NavigationRoutes from '../routes'
import { NotificationContainer } from 'react-notifications'

class App extends Component {
    render() {
        return (
            <Container className="main-container">
                <Navigation></Navigation>
                <NavigationRoutes></NavigationRoutes>
                <NotificationContainer />
            </Container>
        );
    }
}

export default App
