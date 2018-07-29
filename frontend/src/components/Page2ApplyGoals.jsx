import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Page2ApplyGoals extends Component {
    render() {
        return (
            <div>
                Apply Goals

                <br/>
                <Link to={'/page3'}>Next</Link>
            </div>
        );
    }
}
export default Page2ApplyGoals;