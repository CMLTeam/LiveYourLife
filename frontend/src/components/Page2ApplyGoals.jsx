import React, {Component} from 'react';
import {Link} from "react-router-dom";
import 'rc-slider/assets/index.css';
import SliderRow from "./SliderRow";
import {GoogleMap, Marker, Polyline, withGoogleMap, withScriptjs} from "react-google-maps";
// import Routes from './Routes';
import Routes from './Routes1';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import uberLogo from '../uber-logo-9B6033C292-seeklogo.com.png';
import logo from '../logo-2.png';

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
    walk: "#FF7000",
    bike: "#0000FF",
    bus: "#008888",
    metro: "#FF0000",
    uber: "#000000",
    // unknown: "#FFFF00",
};

const ROUTE_ICONS = {
    walk: "walking",
    bike: "bicycle",
    bus: "bus",
    metro: "subway",
    uber: "uber",
};

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={13}
        defaultCenter={{lat: 37.765512, lng: -122.418178}}
    >
        {/*<Marker position={{lat: 37.765512, lng: -122.418178}}/>*/}
        {props.markers && props.markers.map((m, i) => {
                return <Marker key={i}
                               label={String.fromCharCode(65 + i)}
                               position={m.position}/>
            }
        )}
        {props.lines && props.lines.map((l, i) =>
            <Polyline
                key={i}
                options={{
                    strokeColor: l.color,
                    strokeOpacity: 1.0,
                    strokeWeight: 4
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

    componentDidMount() {
        this.selectPreset(balanced);
    }

    selectPreset = (preset) => {
        let presetValues = PRESETS[preset];
        const route = this.determineRouteByPresetName(preset);
        const {cal, cost, duration} = route;
        let linesMarkers = this.coordRouteToLines(route);
        console.info(444, linesMarkers)
        this.setState({
            preset: preset,
            presetValues,
            lines: linesMarkers[0],
            markers: linesMarkers[1],
            cal,
            cost,
            duration
        })
    };

    selectPresetByValues = (presetValues) => {
        const route = this.determineRoute(presetValues[PRICE], presetValues[CALORIES]);
        const {cal, cost, duration} = route;
        let linesMarkers = this.coordRouteToLines(route);
        this.setState({
            presetValues,
            lines: linesMarkers[0],
            markers: linesMarkers[1],
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
        // console.info(111, n, routes)
        routes.sort((a, b) => a.cal - b.cal); // cal asc
        n = (routes.length * minCalories / 100) | 0;
        routes = routes.slice(0, Math.max(n, 1));
        // console.info(222, n, routes)
        routes.sort((a, b) => a.duration - b.duration); // duration asc
        return routes[0];
    };

    coordTripToLines = (trip) => {
        const {legs} = trip;
        return legs.map(leg => {
            return {
                color: ROUTE_COLORS[leg.mode] || "#fff",
                path: leg.geometry.coordinates.map(c => {
                    return {lat: c[1], lng: c[0]}
                })
            }
        })
    };
    coordRouteToLines = (route) => {
        const lines = [];
        const markers = [];
        route.trips.forEach((t, i) => {
            let tripLines = this.coordTripToLines(t);
            markers.push({
                position: tripLines[0].path[0]
            });
            tripLines.forEach(l => {
                lines.push(l)
            });
            if (i === route.trips.length - 1) {
                let pp = tripLines[tripLines.length - 1].path;
                markers.push({
                    position: pp[pp.length - 1]
                })
            }
        });
        return [lines, markers];
    };

    render() {
        const {cal, cost, duration} = this.state;
        return (
            <div>
                <h2 style={{marginBottom:30}}><img src={logo} height={50}/> Live Your Life</h2>

                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === balanced}
                              onChange={this.selectPreset.bind(this, balanced)}/> balanced for you</label>

                &nbsp;&nbsp;&nbsp;&nbsp;
                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === healthiest}
                              onChange={this.selectPreset.bind(this, healthiest)}/> healthiest</label>

                &nbsp;&nbsp;&nbsp;&nbsp;
                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === fastest}
                              onChange={this.selectPreset.bind(this, fastest)}/> fastest</label>

                &nbsp;&nbsp;&nbsp;&nbsp;
                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === cheapest}
                              onChange={this.selectPreset.bind(this, cheapest)}/> cheapest</label>

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
                                               console.info(333, presetValues)
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
                    <table style={{width: '100%', marginTop: 30}}>
                        <tbody>
                        <tr>
                            <td style={{width: '65%'}} align="right" valign="top">
                                <MyMapComponent isMarkerShown
                                                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyC1IqGZUiXvjKfTUc7yDim24FaUwWEe4ro"
                                                loadingElement={<div style={{height: `100%`}}/>}
                                                containerElement={<div style={{height: `400px`, width: '600px'}}/>}
                                                mapElement={<div style={{height: `100%`}}/>}
                                                lines={this.state.lines}
                                                markers={this.state.markers}
                                />
                            </td>
                            <td style={{width: '35%', paddingLeft: 30}} align="left" valign="top">
                                {
                                    Object.keys(ROUTE_COLORS).map(k =>
                                        <div key={k} style={{color: ROUTE_COLORS[k]}}>
                                            <div style={{width: 24, display: 'inline-block'}}>
                                                {
                                                    ROUTE_ICONS[k] === 'uber'
                                                        ? <img src={uberLogo} style={{width: 20}}/>
                                                        : <FontAwesomeIcon icon={ROUTE_ICONS[k]}/>
                                                }
                                            </div>
                                            {' '}{k}
                                        </div>
                                    )
                                }
                                <div style={{paddingTop:130}} className={'summary'}>
                                    <p><FontAwesomeIcon icon={'heartbeat'}/>&nbsp; Calories: <b>{(cal * 100 | 0) / 100}</b></p>
                                    <p><FontAwesomeIcon icon={'money-bill-alt'}/> Cost: <b>${(cost * 100 | 0) / 100}</b></p>
                                    <p><FontAwesomeIcon icon={'stopwatch'}/>&nbsp; Total Duration: <b>{duration / 60 | 0} min</b></p>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                }

                {/*<br/>*/}
                {/*<Link to={'/'}>Prev</Link>*/}
                <div style={{fontSize:'0.8em', marginTop:40}}><a href={'https://www.cmlteam.com'}>© www.cmlteam.com</a></div>
            </div>
        );
    }
}

export default Page2ApplyGoals;