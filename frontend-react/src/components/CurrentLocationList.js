import React, { Component } from 'react';
import { Segment, Icon, Grid, Image, Card } from 'semantic-ui-react';
import * as _ from 'lodash'
import { googleApi } from "../config"
import GoogleMapContainer from '../containers/GoogleMapContainer';

class CurrentLocationList extends Component {
    colors = ["blue", "purple", "orange", "red", "yellow"]
    items = 3
    state = {
        items: 3,
        lat: this.props.currentPosition.lat,
        lng: this.props.currentPosition.lng,
        mapVisible: false
    }
    async showMap(lat, lng, place) {
        if (this.state.mapVisible) {
            this.setState({
                mapVisible: false
            })
        } else {
            this.setState({
                lat: lat,
                lng: lng,
                mapVisible: true,
                place: place
            })
        }
    }
    resetMap = (map, markers) => {
        map = null
        markers.setMap(null)
        markers = []
        this.closeMap()
    }
    closeMap = () => {
        this.setState({
            mapVisible: false
        })
    }
    setCardNums = () => {
        if (window.innerWidth < 650)
            this.setState({
                items: 1
            })
        else if (window.innerWidth < 1200) {
            this.setState({
                items: 2
            })
        }
        else
            this.setState({ items: 3 })
    }

    componentWillMount = () => {
        this.setCardNums()
        window.addEventListener("resize", (ev) => {
            this.setCardNums()
        })
    }
    render() {

        if (!this.props.placesList || this.props.placesList.length === 0)
            return (
                <div style={{ textAlign: "center" }}>No places found.</div>
            );
        else
            return (
                <div>
                    <div hidden={!this.state.mapVisible} className="map-container ">

                        <GoogleMapContainer
                            visible={this.state.mapVisible}
                            initialCenter={{ lat: this.state.lat, lng: this.state.lng }}
                            center={{ lat: this.state.lat, lng: this.state.lng, place: this.state.place }}
                            places={this.props.placesList}
                            currentPosition={this.props.currentPosition}
                            resetMap={this.resetMap}
                            loading={true}
                            closeMap={this.closeMap}
                            query={this.props.query}
                        >

                        </GoogleMapContainer>
                    </div>
                    <Card.Group itemsPerRow={this.state.items}>
                        {this.props.placesList.map(p => {

                            const lat = p.geometry.location.lat
                            const lng = p.geometry.location.lng
                            const color = _.sample(this.colors)
                            const imageSize = 100
                            let openedNow = "?"
                            let src = ""
                            if (p.photos) {
                                const photoreference = p.photos[0].photo_reference
                                src = `${googleApi.photosUrl}maxwidth=200&photoreference=${photoreference}&key=${googleApi.apiKey}`
                            }
                            if (p.opening_hours && p.opening_hours.open_now)
                                openedNow = "OPENED"
                            if (p.opening_hours && !p.opening_hours.open_now)
                                openedNow = "CLOSED"
                            return (
                                <Card color={color} key={p.id}>
                                    <Card.Content>
                                        <Card.Header >
                                            <Grid columns={2}>
                                                <Grid.Column width={12}>
                                                    {p.name}

                                                </Grid.Column>
                                                <Grid.Column textAlign="right" width={4}>
                                                    <Image size="mini" src={p.icon}></Image>
                                                </Grid.Column>
                                            </Grid>
                                        </Card.Header>
                                    </Card.Content>
                                    <Card.Content>
                                        <Grid columns={2} height="100%">
                                            <Grid.Column verticalAlign="middle">

                                                <Card.Meta >
                                                    <Icon name="star"></Icon>
                                                    {p.rating}
                                                </Card.Meta>

                                                <Segment vertical basic compact style={{ paddingBottom: 0 }}>
                                                    <Card.Description>
                                                        {p.vicinity}
                                                        <CurrentStatus opened={openedNow}></CurrentStatus>
                                                    </Card.Description>
                                                </Segment>
                                                <Segment basic vertical style={{ paddingBottom: 0 }}>
                                                    <Icon onClick={this.showMap.bind(this, lat, lng, p)} className="map-icon" title="Map" name="map" color="blue"></Icon>
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <span style={{ borderRadius: "5px", height: imageSize + "px", float: "right", overflow: "hidden" }} >
                                                    <Image src={src} size="small" rounded></Image>
                                                </span>
                                            </Grid.Column>
                                        </Grid>
                                    </Card.Content>
                                </Card>)
                        }
                        )}
                    </Card.Group>
                </div >
            )
    }
}

const CurrentStatus = (props) => {
    if (props.hasOwnProperty("opened") && props.opened == "OPENED")
        return (<p style={{ color: "green" }}>OPENED</p>)
    else if (props.hasOwnProperty("opened") && props.opened == "CLOSED")
        return (<p style={{ color: "red" }}>CLOSED</p>)
    else return (<p>?</p>)
}

export default CurrentLocationList

// geometry:
// location: {lat: 45.8133559, lng: 15.9684515}
// viewport: {northeast: {…}, southwest: {…}}
// __proto__: Object
// icon: "https://maps.gstatic.com/mapfiles/place_api/icons/bar-71.png"
// id: "cf8108be63787f1e3eeb0ae82830ebfddba13bdd"
// name: "Swanky Monkey Garden bar"
// opening_hours: {open_now: true}
// photos: [{…}]
// place_id: "ChIJMc9CVeLWZUcR0KP8N5zPR-E"
// plus_code: {compound_code: "RX79+89 Zagreb, Croatia", global_code: "8FQQRX79+89"}
// price_level: 2
// rating: 4.7
// reference: "ChIJMc9CVeLWZUcR0KP8N5zPR-E"
// scope: "GOOGLE"
// types: (3) ["bar", "point_of_interest", "establishment"]
// vicinity: "Ilica 50, Zagreb"