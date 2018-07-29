import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Page3ShowResults extends Component {
    render() {
        return (
            <div>
                Show Results

                <br/>
                <Link to={'/'}>Prev</Link>
            </div>
        );
    }
}
export default Page3ShowResults;