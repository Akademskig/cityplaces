import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import CurrentLocation from './containers/CurrentLocation'
import App from './containers/App';
import OtherLocations from './containers/OtherLocations';
import LoginPage from './containers/LoginPage'
import { SavedPlaces } from './containers/savedPlaces';

const MainRoutes = (props) => (
    <Switch>
        <Route exact path="/" component={authGuard}></Route>
        <Route path='/locations' component={App} />
        <Route path='/login' component={LoginPage} />
    </Switch>
)

export const NavigationRoutes = (props) => (
    <Switch>
        <Route path='/locations/current' component={CurrentLocation} />
        <Route path='/locations/other' component={OtherLocations} />
        <Route path='/locations/saved' component={SavedPlaces} />
    </Switch>
)

const authGuard = (props) => {
    return <Redirect to="/locations/current" ></Redirect>
}

export default MainRoutes