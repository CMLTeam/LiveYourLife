import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Slider, {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';

const SliderT = Slider.createSliderWithTooltip(Slider);

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

class Page2ApplyGoals extends Component {
    state = {
        preset: ''
    };

    slider = (title, value) => {
        return <table key={title} style={{width: '60%', margin: '0 auto'}}>
            <tbody>
            <tr>
                <td style={{width: '20%'}}>{title}</td>
                <td style={{width: '80%'}}><SliderT value={value}/></td>
            </tr>
            </tbody>
        </table>
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
                                this.slider(p, this.state.presetValues[p])
                            )
                        }
                    </div>
                }
                <Link to={'/page3'}>Next</Link>
            </div>
        );
    }
}

export default Page2ApplyGoals;