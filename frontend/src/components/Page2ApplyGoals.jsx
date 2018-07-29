import React, {Component} from 'react';
import {Link} from "react-router-dom";
import 'rc-slider/assets/index.css';
import SliderRow from "./SliderRow";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

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

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
    >
        {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
    </GoogleMap>));

class Page2ApplyGoals extends Component {
    state = {
        preset: ''
    };

    selectPreset = (preset) => {
        this.setState({preset: preset, presetValues: PRESETS[preset]})
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
                                loadingElement={<div style={{ height: `100%` }} />}
                                containerElement={<div style={{ height: `400px` }} />}
                                mapElement={<div style={{ height: `100%` }} />}/>
                {/*<MyMapComponent isMarkerShown={false} />*/}

                <br/>
                <Link to={'/'}>Prev</Link>
                {' '}<Link to={'/page3'}>Next</Link>
            </div>
        );
    }
}

export default Page2ApplyGoals;