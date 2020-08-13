import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import ProfileForm from '../profile-forms/ProfileForm';
import ExperienceForm from '../profile-forms/ExperienceForm';
import PrivateRoute from './PrivateRoute';

const Routes = () => {
    return (
        <section className='container'>
            <Alert />
            <Switch>
                <Route exact path='/login' component={Login} />
                <Route exact path='/register' component={Register} />
                <PrivateRoute exact path='/dashboard' component={Dashboard} />
                <PrivateRoute
                    exact
                    path='/create-profile'
                    component={ProfileForm}
                />
                <PrivateRoute
                    exact
                    path='/edit-profile'
                    component={ProfileForm}
                />
                <PrivateRoute
                    exact
                    path='/add-experience'
                    component={ExperienceForm}
                />
            </Switch>
        </section>
    );
};

export default Routes;
