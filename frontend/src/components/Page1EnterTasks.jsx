import React, { Component } from 'react';
import {Link} from "react-router-dom";

class Page1EnterTasks extends Component {
    render() {
        return (
            <div>
                Enter Tasks

                <br/>
                <Link to={'/page2'}>Next</Link>
            </div>
        );
    }
}
export default Page1EnterTasks;