import React from "react";
import { Row, Col, Button } from "react-bootstrap"
import { Link } from "react-router-dom";
import {gql, useQuery} from "@apollo/client"
import { useAuthDispatch } from "../context/auth" 

const GET_USERS = gql`
  query getUsers{
    getUsers{
      username email createdAt
    }
  }
`

export default function Home({ history }) {
  const dispatch = useAuthDispatch();
 
  const logout = () => {
    dispatch({type: "LOGOUT"})
    history.push("/login")
  }

  const {loading, data, error} = useQuery(GET_USERS)

  if (error){
    console.log(error)
  }
  if (data){
    console.log(data)
  }

  let usersMarkup;
  if (!data || loading){
    usersMarkup = <p>Loading...</p>
  } else if (data.getUsers.length === 0) {
    usersMarkup = <p>No users yet</p>
  } else if (data.getUsers.length > 0) {
    usersMarkup = data.getUsers.map(user => (
    <div key={user.username}><p>{user.username}</p></div>
    ))
  }

  return (
    <>
    <Row className="bg-white justify-content-around">
      <Link to="/login">
        <Button variant="link">Login</Button>
      </Link>
      <Link to="/register">
        <Button variant="link">Register</Button>
      </Link>
      <Button variant="link" onClick={logout} >Logout</Button>
    </Row>
    <Row className="pt-2">
    <Col xs={4} className="bg-light">
      {usersMarkup}
    </Col>
    <Col xs={8} className="bg-white">
      <p>Here will be messages</p>
    </Col>
    </Row>
   </>
  );
}
