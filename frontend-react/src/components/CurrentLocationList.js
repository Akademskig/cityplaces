import React, { Component } from 'react';
import { Segment, Icon, Grid, Image, Card } from 'semantic-ui-react';
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
