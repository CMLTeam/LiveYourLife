import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Slider, {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';

const SliderT = Slider.createSliderWithTooltip(Slider);

class Page2ApplyGoals extends Component {
    state = {
        preset: ''
    };

    slider = (title, value) => {
        return <table style={{width: '60%', margin: '0 auto'}}>
            <tbody>
            <tr>
                <td style={{width: '20%'}}>{title}</td>
                <td style={{width: '80%'}}><SliderT/></td>
            </tr>
            </tbody>
        </table>
    };

    render() {
        return (
            <div>
                <h2>Apply Goals</h2>

                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === 'fastest'}
                              onChange={() => this.setState({preset: 'fastest'})}/> fastest</label>
                {' '}
                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === 'cheapest'}
                              onChange={() => this.setState({preset: 'cheapest'})}/> cheapest</label>

                {' '}
                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === 'healthiest'}
                              onChange={() => this.setState({preset: 'healthiest'})}/> healthiest</label>

                {' '}
                <label><input type={'radio'} name={'preset'}
                              checked={this.state.preset === 'balanced'}
                              onChange={() => this.setState({preset: 'balanced'})}/> balanced</label>

                {this.slider('Price')}
                {this.slider('Calories')}
                {this.slider('Distance')}
                <br/>
                <Link to={'/page3'}>Next</Link>
            </div>
        );
    }
}

export default Page2ApplyGoals;