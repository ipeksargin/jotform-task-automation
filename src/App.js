import React from 'react';
import Home from './Components/Home';
import SignIn from './Components/SignIn';
import Boards from './Components/Boards';
import Error from './Components/Error';
import {Switch, Route} from 'react-router-dom';
import {PrivateRoute, ProvideAuth} from './hooks/use-auth.js';

function App() {
  return (
    <ProvideAuth>
      <div className="App">
        <Switch>
          <PrivateRoute exact path="/boards" component={Boards} />
          <Route exact path="/error" component={Error}></Route>
          <Route exact path="/boards/:boardid" component={Home}></Route>
          <Route exact path="/" component={SignIn}></Route>
        </Switch>
      </div>
    </ProvideAuth>
  );
}

export default App;
