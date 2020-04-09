/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// Les imports importants
import React, { useState, useContext } from 'react';
import ReactDOM from 'react-dom';

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route, withRouter } from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/AuthAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log('Hello Webpack Encore!!! Edit me in assets/js/app.js');

AuthAPI.setUp();

const App = () => {
    // TODO : il faudrait demander à notre AuthAPI si on est connecté ou pas
    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthAPI.isAuthenticated()
    );

    const NavbarWithRouter = withRouter(Navbar);

    const contextValue = {
        isAuthenticated: isAuthenticated,
        setIsAuthenticated: setIsAuthenticated
    };

    return <>
        <AuthContext.Provider value={contextValue}>
            <HashRouter>
                <NavbarWithRouter />
                <main className="container pt-5">
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <PrivateRoute path="/invoices" component={InvoicesPage} />
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    </>;
}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);
