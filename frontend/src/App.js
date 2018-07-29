import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import Page1EnterTasks from "./components/Page1EnterTasks";
import Page2ApplyGoals from "./components/Page2ApplyGoals";
import Page3ShowResults from "./components/Page3ShowResults";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
            <Switch>
                <Route exact path={'/'} component={Page1EnterTasks}/>
                <Route exact path={'/page2'} component={Page2ApplyGoals}/>
                <Route exact path={'/page3'} component={Page3ShowResults}/>
            </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
