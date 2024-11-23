import { useState, useContext, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


import { BrowserRouter, Routes, Route, useNavigate } from "react-router";


import { authContext } from './contexts';
import { PrivateRoute } from './PrivateRoute.js';


export function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const context = useContext(authContext);
  const navigate = useNavigate();

  const attemptLogin = () => {
    fetch(
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
    )
    .then(async (response) => {
      if (response.status === 200) {
          const data = await response.json();
          context.setBearerToken(data.accessToken);
          context.setAuthenticated(true);
          navigate("/");
      }
    });
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col className="text-center">
            <h3>Login</h3>
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

function Logout() {

  const context = useContext(authContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    context.setBearerToken("");
    context.setAuthenticated("");  
  }, []);

  navigate("/login");
}

export function Home() {
  
  return (
    <>
      <h3>Home</h3>
    </>
  )
}

export function App() {

  const context = useContext(authContext);

  return (
      context.contextLoaded ? (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<PrivateRoute />} >
            <Route exact path="/" element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter> ) : null
  )
}
