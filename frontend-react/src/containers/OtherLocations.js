import React, { Component } from 'react';
import { Segment, Form, Input, Button, Grid, GridColumn, Icon, Header } from 'semantic-ui-react'
import PlacesList from '../components/PlacesList'
import PlacesApi from '../google-maps-api/places'

class OtherLocations extends Component {
    constructor() {
        super()
        this.gma = new PlacesApi()
    }

    getPosition = (reset) => {
        this.setState({ loading: true })
        this.gma.getCurrentPosition(reset).then(data => {
            this.setState({
                loading: false,
                location: data.location,
                lat: data.lat,
                lng: data.lng
            })


        })
    }
    setNewLoc = (loc, newPlace) => {
        this.setState({ lat: loc.lat, lng: loc.lng })
        this.setState({ location: newPlace })

    }
    state = {
        loading: false,
        loadingPlaces: false,
        location: "!"
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
                        })
                })
                this.setState({
                    loadingPlaces: false,
                    placesList: placesList,
                    filteredPlaces: placesList
                })
            })
        this.setState({
            query: data
        })
    }

    handleSearch = (value) => {
        const filteredPlaces = this.state.placesList.filter((pl) => pl.name.toLowerCase().match(value.toLowerCase()))
        this.setState({
            filteredPlaces: filteredPlaces
        })
    }
    getPlacesFromMap = (places) => {
        this.setState({
            filteredPlaces: places,
            placesList: places
        })
    }
    componentWillMount() {
        this.getPosition(false)
    }
    componentDidMount = () => {

    }
    onKeyword = (keyword) => {
        this.setState({ query: { keyword: keyword } })
    }

    render() {
        return (
            <Segment.Group >
                <Segment textAlign="center" loading={this.state.loading}>
                    <OtherLocationsView
                        location={this.state.location}
                    >
                    </OtherLocationsView>
                </Segment>
                <Segment>
                    <SearchOtherForm onKeyword={this.onKeyword} findPlaces={this.getPlaces} onSearch={this.handleSearch}></SearchOtherForm>
                </Segment>
                <Segment loading={this.state.loadingPlaces}>
                    <PlacesList
                        setNewLoc={this.setNewLoc}
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

export default OtherLocations;
class SearchOtherForm extends Component {

    state = {
        city: "",
        keyword: ""
    }

    handleSearch = (e) => {
        this.props.onSearch(e.target.value)
    }
    handlePlaceChange = (e) => {
        this.setState({ keyword: e.target.value })
    }

    handleCityChange = (e) => {
        this.setState({
            city: e.target.value
        })
    }

    handleSubmit = () => {
        this.props.findPlaces(this.state)
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
                            placeholder='Search city places'
                            defaultValue={this.state.input} />
                    </Form.Field>

                    <Form.Field>
                        <Input
                            id="searchCityField"
                            type="text"
                            ref={ref => (this.autocomplete = ref)}
                            placeholder='Search cities'
                            defaultValue={this.state.inputCity} />

                    </Form.Field>
                    <div id="infowindow-content"></div>
                </Form.Group>
                <Grid columns={2}>
                    <GridColumn>
                        <Button icon color="purple" labelPosition='left'>
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
class OtherLocationsView extends Component {

    render() {
        return (
            <div>
                <Header size="medium" icon>
                    <Icon name="building" size="small"></Icon>
                    {this.props.location}
                </Header>

            </div>
        )
    }
}
