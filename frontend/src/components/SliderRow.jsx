import React, {Component} from 'react';
import Slider from "rc-slider";
const SliderT = Slider.createSliderWithTooltip(Slider);

class SliderRow extends Component {
    state = {
        value: 0
    };

    componentDidMount () {
        this.setState({value: this.props.value})
    }

    render() {
        return <table style={{width: '60%', margin: '0 auto'}}>
            <tbody>
            <tr>
                <td style={{width: '20%'}}>{this.props.title}</td>
                <td style={{width: '80%'}}>
                    <SliderT value={this.state.value}
                             onChange={(value) => {
                                 this.setState({value})
                             }}
                             marks={{0: '0', 100: '100%'}}
                    />
                </td>
            </tr>
            </tbody>
        </table>;
    }
}

export default SliderRow;