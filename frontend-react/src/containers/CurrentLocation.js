import React, { Component } from 'react';
import { Segment, Input, Icon, Form, Grid, GridColumn, Button, Header } from 'semantic-ui-react';
import PlacesList from '../components/PlacesList';
import PlacesApi from "../services/places"
import { notify } from '../services/notifications'

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
        }).catch(err => {
            notify("error", err.message)
            this.setState({ loading: false })
        })
    }
    getPlacesFromMap = (places) => {
        this.setState({
            filteredPlaces: places,
            placesList: places
        })
    }

    getPlaces = (data) => {
        this.setState({ loadingPlaces: true })
        this.gma.getPlaces(data.radius, data.keyword, { lat: this.state.lat, lng: this.state.lng })
            .then((data) => {
                let placesList = data.data.data
                placesList.forEach(p => {
                    this.gma.getDetails(p.place_id, "opening_hours,url")
                        .then(d => {
                            p["opening_hours"] = d.data && d.data.data ? d.data.data.opening_hours : null
                            p["url"] = d.data && d.data.data ? d.data.data.url : null
                        }).catch(err => {
                            notify("error", err.message)
                            this.setState({ loadingPlaces: false })
                        })
                })
                this.setState({
                    loadingPlaces: false,
                    placesList: placesList,
                    filteredPlaces: placesList
                })
            }).catch(err => {
                notify("error", err.message)
                this.setState({ loadingPlaces: false })
            })
        this.setState({
            query: data
        })
    }

    handleSearch = (value) => {
        let filteredPlaces = this.state.placesList ? this.state.placesList.filter((pl) => pl.name.toLowerCase().match(value.toLowerCase())) : null
        this.setState({
            filteredPlaces: filteredPlaces
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
                    <SearchCurrentForm getPlaces={this.getPlaces} onSearch={this.handleSearch}></SearchCurrentForm>
                </Segment>
                <Segment loading={this.state.loadingPlaces}>
                    <PlacesList
                        {...this.props}
                        query={this.state.query}
                        placesList={this.state.filteredPlaces}
                        getPlaces={this.getPlacesFromMap}
                        currentPosition={{ lat: this.state.lat, lng: this.state.lng }}
                    ></PlacesList>

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
            <div >
                <Header style={{ opacity: 1 }} size="medium" icon>
                    <Icon name="building" size="small"></Icon>
                    {this.props.location}
                </Header>
            </div>
        )
    }
}

class SearchCurrentForm extends Component {

    state = {
        keyword: "karaoke",
        radius: "300"
    }

    handleSearch = (e) => {
        this.props.onSearch(e.target.value)
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
                <Grid columns={2}>
                    <GridColumn>
                        <Button icon color="orange" labelPosition='left' disabled={!this.state.keyword}>
                            <Icon name='location arrow' />
                            Go
                </Button>
                    </GridColumn>
                    <GridColumn textAlign="right">
                        <div className='ui transparent icon input' >
                            <Input
                                icon='search'
                                iconPosition='left'
                                placeholder='Search...'
                                className='prompt'
                                floated="right"
                                onChange={this.handleSearch.bind(this)}
                            />
                        </div>
                    </GridColumn>
                </Grid>
            </Form>
        )
    }

}

