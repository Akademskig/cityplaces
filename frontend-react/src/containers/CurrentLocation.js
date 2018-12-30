import React, { Component } from 'react';
import { Container, Segment, Input, Icon, Divider, SegmentInline, Form, Grid, GridColumn, Button, Header, HeaderSubheader } from 'semantic-ui-react';
import CurrentLocationList from '../components/CurrentLocationList';
import GoogleMapsApi from "../googe-maps-api"


class CurrentLocation extends Component {

    state = {
        loading: true,
        position: ""
    }
    constructor() {
        super()
        this.gma = new GoogleMapsApi()
    }

    getFormData = (data) => {
        this.setState(data)
    }

    getPosition = (reset) => {
        this.setState({ loading: true })
        this.gma.getCurrentPosition(reset).then(data => {
            this.setState({
                loading: false,
                position: data
            })
        })
    }

    getPlaces = (data) => {
        this.setState({ loadingPlaces: true })
        this.gma.getPlaces(data.radius, data.keyword)
            .then((data) => {
                console.log(data)
                this.setState({
                    loadingPlaces: false,
                    placesList: data.data.data
                })
            })
    }
    componentWillMount = () => {
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
                    <CurrentLocationList placesList={this.state.placesList} ></CurrentLocationList>
                </Segment>
            </Segment.Group>
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
        radius: "100"
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

