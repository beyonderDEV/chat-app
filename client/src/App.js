import React from "react";
import "./App.scss";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Provider from "./ApolloProvider";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Container className="mt-5">
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route path="/register" component={Register}></Route>
            <Route path="/login" component={Login}></Route>
          </Switch>
        </Container>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
