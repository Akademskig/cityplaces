import React, { Component } from 'react';
import { Container, Segment, Input, Icon, Divider, SegmentInline, Form, Grid, GridColumn, Button, Header, HeaderSubheader } from 'semantic-ui-react';
import CurrentLocationList from '../components/CurrentLocationList';
import PlacesApi from "../googe-maps-api/places"
import { GoogleMapContainer } from './GoogleMapContainer';


class CurrentLocation extends Component {

    state = {
        loading: true,
        position: "",
        mapVisible: false,
        lat: null,
        lng: null
    }
    constructor() {
        super()
        this.gma = new PlacesApi()
    }

    getFormData = (data) => {
        this.setState(data)
    }

    getPosition = (reset) => {
        this.setState({ loading: true })
        this.gma.getCurrentPosition(reset).then(data => {
            this.setState({
                loading: false,
                position: data.location,
                lat: data.lat,
                lng: data.lng
            })
        })
    }

    getPlaces = (data) => {
        this.setState({ loadingPlaces: true })
        this.gma.getPlaces(data.radius, data.keyword)
            .then((data) => {
                let placesList = data.data.data
                placesList.forEach(p => {
                    this.gma.getDetails(p.place_id, "opening_hours")
                        .then(d => {
                            p["opening_hours"] = d.data.data.opening_hours
                        })
                })
                this.setState({
                    loadingPlaces: false,
                    placesList: placesList
                })
            })
        this.setState({
            query: data
        })
    }

    componentWillMount() {
        this.getPosition(false)
    }
    render() {
        return (
            <Segment.Group>
                <Segment textAlign="center" loading={this.state.loading}>
                    <CurrentPositionView
                        location={this.state.position}
                        resetPosition={this.getPosition}>
                    </CurrentPositionView>
                </Segment>
                <Segment>
                    <SearchCurrentForm getPlaces={this.getPlaces}></SearchCurrentForm>
                </Segment>
                <Segment loading={this.state.loadingPlaces}>
                    <CurrentLocationList
                        query={this.state.query}
                        placesList={this.state.placesList}
                        currentPosition={{ lat: this.state.lat, lng: this.state.lng }}
                    ></CurrentLocationList>

                </Segment>
            </Segment.Group >
        );
    }
}

export default CurrentLocation;

class CurrentPositionView extends Component {
    reset = (e) => {
        e.preventDefault()
        this.props.resetPosition(true)
    }
    render() {
        return (
            <div>
                <Header size="medium" icon>
                    <Icon name="building" size="small"></Icon>
                    {this.props.location}
                </Header>
                <Header.Subheader>
                    <Button icon="redo" circular onClick={this.reset} basic color="blue">
                    </Button>
                </Header.Subheader>
            </div>
        )
    }
}

class SearchCurrentForm extends Component {

    state = {
        keyword: "bar",
        radius: "300"
    }
    handlePlaceChange = (e) => {
        this.setState({
            keyword: e.target.value
        })
    }
    handleRadiusChange = (e) => {
        this.setState({
            radius: e.target.value
        })
    }
    handleSubmit = () => {
        this.props.getPlaces(this.state)
    }
    render() {
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} >
                <Form.Group widths="2">
                    <Form.Field>
                        <Input
                            onChange={this.handlePlaceChange.bind(this)}
                            icon='building'
                            iconPosition='left'
                            placeholder='Search places'
                            value={this.state.keyword} />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            onChange={this.handleRadiusChange.bind(this)}
                            type="number"
                            min="50"
                            step="50"
                            label="m"
                            labelPosition="right"
                            icon='location arrow'
                            iconPosition='left'
                            value={this.state.radius}
                            placeholder='Set radius (m)' />
                    </Form.Field>
                </Form.Group>
                <Button icon color="purple" labelPosition='left'>
                    <Icon name='location arrow' />
                    Go
                </Button>
            </Form>
        )
    }

}
