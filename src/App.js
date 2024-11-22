import { useState, useContext } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


import { BrowserRouter, Routes, Route } from "react-router";


import { AuthContextProvider, authContext } from './contexts';


export function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const context = useContext(authContext);

  const attemptLogin = async () => {
    let res = await fetch(
      'http://192.168.1.10/login',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      }
    );
    const data = await res.json();
    context.setBearerToken(data.accessToken);
  }


  return (
    <>
      <Container fluid>
        <Row>
          <Col className="text-center">
            <h3>Login</h3>
            <h5>{context.bearerToken}</h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              onClick={() => {
                attemptLogin();
              }}
            >Login</Button>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export function Home() {
  
  const context = useContext(authContext);

  return (
    <>
      <h3>Home</h3>
      <div>
        {context.bearerToken}
      </div>
    </>
  )
}

export function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  )
}
