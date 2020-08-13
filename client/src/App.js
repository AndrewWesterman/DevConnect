import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';
import Routes from './components/routing/Routes';

// If we already have a token apply it to request headers
if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    // On app startup, attempt to load user (with active token)
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Route exact path='/' component={Landing} />
                    <Route component={Routes} />
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;
