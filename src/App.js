import { useContext, useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Card, Row, Col, Stack, Form, Button} from 'react-bootstrap';

import { BrowserRouter, Routes, Route } from "react-router";

import { authContext } from './contexts';
import { PrivateRoute } from './PrivateRoute.js';
import { Game } from './Game.js';

import {Login, Logout, Register} from './Authentication.js';


export function AppNavbar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-5">
      <Container>
        <Navbar.Brand href="/">Inventory Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/characters">Characters</Nav.Link>
            <NavDropdown title="Profile" id="basic-nav-dropdown">
              <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/logout">
                 Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}


export function Home() {
  
  return (
    <>
      <h3>Home</h3>
    </>
  )
}

function Inventories() {
  const [inventories, setInventories] = useState([]);
  const [inventoryName, setInventoryName] = useState("");
  const [inventoryDescription, setInventoryDescription] = useState("");

  const context = useContext(authContext);

  useEffect(() => {
    getInventories();
  }, []);

  const getInventories = () => {
    fetch(
      'http://192.168.1.10/api/inventories',
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.bearerToken
        }
      }
    ).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        setInventories(data);
      }
    });
  };

  const inventoryList = inventories.map((inventory, _) => {
    return (
      <Col key={inventory.id}>
      <Card>
        <Card.Body>
          <Card.Title>{inventory.name}</Card.Title>
          <Card.Text>
            {inventory.description}
          </Card.Text>
          <Button variant="primary">View</Button>
        </Card.Body>
      </Card>
      </Col>
    )
  });

  const createInventory = () => {
    fetch(
      'http://192.168.1.10/api/inventories',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.bearerToken
        },
        body: JSON.stringify({
          name: inventoryName,
          description: inventoryDescription
        })
      }
    ).then(async (response) => {
      if (response.status === 201) {
        setInventories([...inventories, await response.json()]);
      }
    });
  };


  return (
    <>
      <button onClick={getInventories}>get inventories</button>
      <Container fluid>
        <Row>
            {inventoryList}
        </Row>
        <Stack gap={3} className="col-xxl-2 offset-xxl-5 col-md-4 offset-md-4">
          <div className="text-center">
            <h3>Create Inventory</h3>
          </div>
          <div>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="inventoryName"
              onChange={(e) => {
                setInventoryName(e.target.value);
              }}
            />
          </div>
          <div>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="inventoryDescription"
              onChange={(e) => {
                setInventoryDescription(e.target.value);
              }}
            />
          </div>
          <div className="d-grid gap-2">
            <Button
              onClick={() => {
                createInventory();
              }}
            >Create</Button>
          </div>
        </Stack>
      </Container>
    </>
  )
}

export function Settings() {
  
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <h3>Settings</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Inventories</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <Inventories />
          </Col>
        </Row>
      </Container>
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
          <Route exact path="/settings" element={<PrivateRoute />} >
            <Route exact path="/settings" element={<Settings />} />
          </Route>
          <Route exact path="/game" element={<PrivateRoute />} >
            <Route exact path="/game" element={<Game />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter> ) : null
  )
}
