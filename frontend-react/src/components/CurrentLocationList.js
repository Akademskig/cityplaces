import React, { Component } from 'react';
import { Container, Segment, Input, Icon, Grid, Divider, SegmentInline, CardHeader, Image, Card, CardContent, GridColumn } from 'semantic-ui-react';
import * as _ from 'lodash'
import { googleApi } from "../config"


class CurrentLocationList extends Component {
    colors = ["blue", "purple", "orange", "red", "yellow"]
    state = {
        items: 3
    }
    render() {

        if (!this.props.placesList || this.props.placesList.length === 0)
            return (
                <div style={{ textAlign: "center" }}>No places found.</div>
            );
        else
            return (
                <Card.Group itemsPerRow={this.state.items}>
                    {this.props.placesList.map(p => {
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
                                    <Card.Header icon>
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
                                    <Grid columns={2}>
                                        <Grid.Column>

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
                                                <Icon className="map-icon" title="Map" name="map" color="blue"></Icon>
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

// geometry: {location: {…}, viewport: {…}}
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