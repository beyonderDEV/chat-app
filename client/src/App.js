import React from "react";
import "./App.scss";
import { Container } from "react-bootstrap";
import Register from "./pages/Register";

function App() {
  return (
    <Container className="mt-5">
      <Register />
    </Container>
  );
}

export default App;
