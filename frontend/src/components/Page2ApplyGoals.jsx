import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Page2ApplyGoals extends Component {
    state = {
        preset: ''
    }

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

                <br/>
                <Link to={'/page3'}>Next</Link>
            </div>
        );
    }
}

export default Page2ApplyGoals;