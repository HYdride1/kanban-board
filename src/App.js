import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Kanban from './components/kanban';
import SignIn from './components/signIn.js';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={SignIn} />
        <Route path="/kanban" component={Kanban} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default App;

