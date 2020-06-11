import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom'

// import Auth from './components/Auth/Auth'
import Main from './components/Main/Main'
import Guest from './components/Guest/Guest'

class App extends Component {
  render() {
    return (
        <div className="App">
          <Switch>
          <Route path='/guest'>
              <Guest></Guest>
            </Route>
            <Route path='/'>
              <Main></Main>
            </Route>
          </Switch>
        </div>
    );
  }
}

export default App;
