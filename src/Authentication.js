import { useState, useContext, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Stack from 'react-bootstrap/Stack';
import InputGroup from 'react-bootstrap/InputGroup';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from "react-router";

import { authContext } from './contexts';


export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const attemptRegister = () => {

    if (passwordCheck !== password) {
      setErrors(["Passwords do not match."]);
      return;
    }

    fetch(
      'http://192.168.1.10/register',
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
          navigate("/login");
      } else if (response.status === 400) {
        const data = await response.json();
        let errorMessages = [];
        for (var prop in data.errors) {
          errorMessages.push(...data.errors[prop]);
        }
        setErrors(errorMessages);
      }
    });
  }

  const errorList = errors.map((error, index) => {
    return (
      <Alert
        key={index}
        variant="warning"
      >
        {error}
      </Alert>
    )
  });

  const ErrorSection = () => {
    if (errors.length > 0) { 
      return (        
        <div md={{ span: 4, offset: 4}}>
          {errorList}
        </div>
      ) 
    }
    return null;
  }

  return (
    <>
      <Container fluid>
        <Stack gap={3} className="col-xxl-2 offset-xxl-5 col-md-4 offset-md-4">
          <div className="text-center">
            <h3>Register</h3>
          </div>
          <div>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <Form.Label htmlFor='password'>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <InputGroup.Text
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                { showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }
              </InputGroup.Text>
            </InputGroup>
          </div>
          <div>
            <Form.Label htmlFor='password'>Confirm</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPasswordCheck ? "text" : "password"}
                name="passwordCheck"
                onChange={(e) => {
                  setPasswordCheck(e.target.value);
                }}
              />
              <InputGroup.Text
                onClick={() => {
                  setShowPasswordCheck(!showPasswordCheck);
                }}
              >
                { showPasswordCheck ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }
              </InputGroup.Text>
            </InputGroup>
          </div>
          <div className="d-grid gap-2">
            <Button
              onClick={() => {
                attemptRegister();
              }}
            >Register</Button>
            <Form.Text className="text-muted">
              Already have an account? <a href="/login">Login</a>
            </Form.Text>
          </div>
          <ErrorSection />  
        </Stack>
      </Container>
    </>
  )
}


export function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        <Stack gap={3} className="col-xxl-2 offset-xxl-5 col-md-4 offset-md-4">
          <div className="text-center">
            <h3>Login</h3>
          </div>
          <div>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <Form.Label htmlFor='password'>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <InputGroup.Text
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                { showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }
              </InputGroup.Text>
            </InputGroup>
          </div>
          <div className="d-grid gap-2">
            <Button
              onClick={() => {
                attemptLogin();
              }}
            >Login</Button>
            <Form.Text className="text-muted">
              Don't have an account? <a href="/register">Register</a>
            </Form.Text>
          </div>
        </Stack>
      </Container>
    </>
  )
}


export function Logout() {

  const context = useContext(authContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    context.setBearerToken("");
    context.setAuthenticated("");  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  navigate("/login");
}
