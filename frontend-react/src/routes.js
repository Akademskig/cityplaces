import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import CurrentLocation from './containers/CurrentLocation'
import App from './containers/App';
import OtherLocations from './containers/OtherLocations';
import LoginPage from './containers/LoginPage'
import { SavedPlaces } from './containers/savedPlaces';
import { googleApi } from './config'
import { GoogleApiWrapper } from 'google-maps-react';
export const MainRoutes = (props) => (
    <Switch>
        <Route exact path="/" component={authGuard}></Route>
        <Route path='/locations' component={App} />
        <Route path='/login' component={LoginPage} />
    </Switch>
)

export const NavigationRoutes = (props) => (
    <Switch>
        <Route path='/locations/current' render={() => <CurrentLocation {...props} />} />
        <Route path='/locations/other' render={() => <OtherLocations {...props} />} />
        <Route path='/locations/saved' render={() => <SavedPlaces {...props} />} />
    </Switch>
)

const authGuard = (props) => {
    return <Redirect to="/locations/current" ></Redirect>
}
export default GoogleApiWrapper({
    apiKey: (googleApi.apiKey)
})(NavigationRoutes)

