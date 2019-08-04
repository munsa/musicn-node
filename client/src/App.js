import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/layout/Home';
import './css/custom.min.css';
// Redux
import { Provider } from 'react-redux';
import store from './store';

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <section className='container'>
          <Switch>
            <Route exact path='/' component={Home} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
