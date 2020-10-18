import React from "react";
import "./App.scss";
import { Container } from "react-bootstrap";
import { BrowserRouter, Switch } from "react-router-dom";

import Provider from "./ApolloProvider";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";


import { AuthProvider } from "./context/auth"
import DynamicRoute from "./util/DynamicRoute"

function App() {
  return (
    <Provider>
      <AuthProvider>
        <BrowserRouter>
          <Container className="mt-5">
            <Switch>
              <DynamicRoute exact path="/" component={Home} authenticated></DynamicRoute>
              <DynamicRoute path="/register" component={Register} guest></DynamicRoute>
              <DynamicRoute path="/login" component={Login} guest></DynamicRoute>
            </Switch>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
