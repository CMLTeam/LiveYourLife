import React, {Component} from 'react';
import {Link} from "react-router-dom";
import 'rc-slider/assets/index.css';
import SliderRow from "./SliderRow";
import {withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline} from "react-google-maps";
import Routes from './Routes';

const PRESETS = {
    'fastest': {
        'Price': 90,
        'Calories': 10,
        'Distance': 20
    },
    'cheapest': {
        'Price': 20,
        'Calories': 70,
        'Distance': 70
    },
    'healthiest': {
        'Price': 50,
        'Calories': 90,
        'Distance': 10
    },
    'balanced': {
        'Price': 50,
        'Calories': 50,
        'Distance': 50
    },
};

const ROUTE_COLORS = {
    walk: "#00FF00",
    bike: "#0000FF",
    aaa: "#FF0000",
    unknown: "#FFFF00",
    ccc: "#00FFFF"
};

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{lat: -34.397, lng: 150.644}}
    >
        {props.isMarkerShown && <Marker position={{lat: -34.397, lng: 150.644}}/>}
        {props.lines && props.lines.map((l,i) =>
            <Polyline
                key={i}
                options={{
                    strokeColor: l.color,
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                }}
                path={l.path}
            />
        )}
    </GoogleMap>));

class Page2ApplyGoals extends Component {
    state = {
        preset: ''
    };

    selectPreset = (preset) => {
        this.setState({preset: preset, presetValues: PRESETS[preset]})
    };

    coordTripToLines = (trip) => {
        const {legs} = trip;
        return legs.map(leg => {
            return {
                color: ROUTE_COLORS[leg.mode || 'unknown'],
                path: leg.geometry.coordinates.map(c => {
                    return {lat: c[1], lng: c[0]}
                })
            }
        })
    };

    render() {
        return (
            <div>
                <h2>Apply Goals</h2>

                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === 'fastest'}
                              onChange={this.selectPreset.bind(this, 'fastest')}/> fastest</label>
                {' '}
                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === 'cheapest'}
                              onChange={this.selectPreset.bind(this, 'cheapest')}/> cheapest</label>

                {' '}
                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === 'healthiest'}
                              onChange={this.selectPreset.bind(this, 'healthiest')}/> healthiest</label>

                {' '}
                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === 'balanced'}
                              onChange={this.selectPreset.bind(this, 'balanced')}/> balanced</label>

                {
                    this.state.preset
                    &&
                    <div>
                        {
                            ['Price', 'Calories', 'Distance'].map(p =>
                                <SliderRow title={p} key={this.state.preset + p} value={this.state.presetValues[p]}/>
                            )
                        }
                    </div>
                }

                <MyMapComponent isMarkerShown
                    // googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyC1IqGZUiXvjKfTUc7yDim24FaUwWEe4ro"
                                loadingElement={<div style={{height: `100%`}}/>}
                                containerElement={<div style={{height: `400px`, width: '600px'}}/>}
                                mapElement={<div style={{height: `100%`}}/>}

                                lines={this.coordTripToLines(Routes[0].trips[0])}
                />

                <br/>
                <Link to={'/'}>Prev</Link>
                {' '}<Link to={'/page3'}>Next</Link>
            </div>
        );
    }
}

export default Page2ApplyGoals;