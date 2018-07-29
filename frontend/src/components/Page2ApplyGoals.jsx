import React, {Component} from 'react';
import {Link} from "react-router-dom";
import 'rc-slider/assets/index.css';
import SliderRow from "./SliderRow";
import {withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline} from "react-google-maps";
import Routes from './Routes';

const PRICE = 'Max Price';
const CALORIES = 'Min Calories';

const fastest = 'fastest';
const cheapest = 'cheapest';
const healthiest = 'healthiest';
const balanced = 'balanced';

const PRESETS = {
    [fastest]: {
        [PRICE]: 95,
        [CALORIES]: 5,
    },
    [cheapest]: {
        [PRICE]: 10,
        [CALORIES]: 20,
    },
    [healthiest]: {
        [PRICE]: 30,
        [CALORIES]: 90,
    },
    [balanced]: {
        [PRICE]: 50,
        [CALORIES]: 50,
    },
};

const ROUTE_COLORS = {
    walk: "#00FF00",
    bike: "#0000FF",
    bus: "#008888",
    metro: "#FF0000",
    // unknown: "#FFFF00",
};

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={13}
        defaultCenter={{lat: 37.765512, lng: -122.418178}}
    >
        {/*{props.isMarkerShown && <Marker position={{lat: -34.397, lng: 150.644}}/>}*/}
        {props.lines && props.lines.map((l, i) =>
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
        preset: '',
        lines: []
    };

    selectPreset = (preset) => {
        let presetValues = PRESETS[preset];
        const route = this.determineRouteByPresetName(preset);
        const {cal, cost, duration} = route;
        this.setState({
            preset: preset,
            presetValues,
            lines: this.coordRouteToLines(route),
            cal,
            cost,
            duration
        })
    };

    selectPresetByValues = (presetValues) => {
        const route = this.determineRoute(presetValues[PRICE], presetValues[CALORIES]);
        const {cal, cost, duration} = route;
        this.setState({
            presetValues,
            lines: this.coordRouteToLines(route),
            cal,
            cost,
            duration
        })
    };

    determineRouteByPresetName = (preset) => {
        let routes = [...Routes];
        if (preset === fastest) {
            routes.sort((a, b) => a.duration - b.duration); // duration asc
            return routes[0];
        } else if (preset === cheapest) {
            routes.sort((a, b) => a.cost - b.cost); // cost asc
            return routes[0];
        } else if (preset === healthiest) {
            routes.sort((a, b) => -(a.cal - b.cal)); // cal desc
            return routes[0];
        } else if (preset === balanced)
            return this.determineRoute(50, 50);
    };

    determineRoute = (maxPrice, minCalories) => {
        let routes = [...Routes];
        routes.sort((a, b) => a.cost - b.cost); // cost asc
        let n = (routes.length * maxPrice / 100) | 0;
        routes = routes.slice(0, Math.max(n, 1));
        console.info(111, n, routes)
        routes.sort((a, b) => a.cal - b.cal); // cal asc
        n = (routes.length * minCalories / 100) | 0;
        routes = routes.slice(0, Math.max(n, 1));
        console.info(222, n, routes)
        routes.sort((a, b) => a.duration - b.duration); // duration asc
        return routes[0];
    };

    coordTripToLines = (trip) => {
        const {legs} = trip;
        return legs.map(leg => {
            return {
                color: ROUTE_COLORS[leg.mode],
                path: leg.geometry.coordinates.map(c => {
                    return {lat: c[1], lng: c[0]}
                })
            }
        })
    };
    coordRouteToLines = (route) => {
        const lines = [];
        route.trips.forEach(t => {
            this.coordTripToLines(t).forEach(l => {
                lines.push(l)
            })
        });
        return lines;
    };

    render() {
        const {cal, cost, duration} = this.state;
        return (
            <div>
                <h2>Best Plan For You</h2>

                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === fastest}
                              onChange={this.selectPreset.bind(this, fastest)}/> fastest</label>

                &nbsp;&nbsp;&nbsp;&nbsp;
                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === cheapest}
                              onChange={this.selectPreset.bind(this, cheapest)}/> cheapest</label>

                &nbsp;&nbsp;&nbsp;&nbsp;
                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === healthiest}
                              onChange={this.selectPreset.bind(this, healthiest)}/> healthiest</label>

                &nbsp;&nbsp;&nbsp;&nbsp;
                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === balanced}
                              onChange={this.selectPreset.bind(this, balanced)}/> balanced</label>

                {
                    this.state.preset
                    &&
                    <div>
                        {
                            [PRICE, CALORIES].map(p =>
                                <SliderRow title={p}
                                           key={this.state.preset + p}
                                           value={this.state.presetValues[p]}
                                           onChange={(v) => {
                                               let {presetValues} = this.state;
                                               presetValues = {...presetValues, [p]: v};
                                               console.info(333,presetValues)
                                               this.setState({presetValues});
                                               this.selectPresetByValues(presetValues);
                                           }}
                                />
                            )
                        }
                    </div>
                }

                {
                    this.state.lines.length !== 0
                    &&
                    <table style={{width: '100%', marginTop: 20}}>
                        <tbody>
                        <tr>
                            <td style={{width: '50%'}} align="right" valign="top">
                                <MyMapComponent isMarkerShown
                                                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyC1IqGZUiXvjKfTUc7yDim24FaUwWEe4ro"
                                                loadingElement={<div style={{height: `100%`}}/>}
                                                containerElement={<div style={{height: `400px`, width: '600px'}}/>}
                                                mapElement={<div style={{height: `100%`}}/>}
                                                lines={this.state.lines}
                                />
                            </td>
                            <td style={{width: '10%', paddingLeft: 20}} align="left" valign="top">
                                {
                                    Object.keys(ROUTE_COLORS).map(k =>
                                        <div key={k} style={{color: ROUTE_COLORS[k]}}>{k}</div>
                                    )
                                }
                            </td>
                            <td style={{width: '40%'}} align="left" valign="top">
                                <p>Calories: <b>{(cal * 100 | 0) / 100}</b></p>
                                <p>Cost: <b>${(cost * 100 | 0) / 100}</b></p>
                                <p>Total Duration: <b>{duration / 60 | 0} min</b></p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                }

                <br/>
                <Link to={'/'}>Prev</Link>
            </div>
        );
    }
}

export default Page2ApplyGoals;