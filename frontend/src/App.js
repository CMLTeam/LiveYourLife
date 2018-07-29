import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Page1EnterTasks from "./components/Page1EnterTasks";
import Page2ApplyGoals from "./components/Page2ApplyGoals";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
            <Switch>
                <Route exact path={'/'} component={Page1EnterTasks}/>
                <Route exact path={'/page2'} component={Page2ApplyGoals}/>
            </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
