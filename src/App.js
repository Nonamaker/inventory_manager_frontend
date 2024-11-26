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
import { CreateInventory, CreateItem, DeleteInventory, DeleteItem, GetInventories, GetInventory, GetInventoryContents, MoveItem } from './InventoryAPI.js';

import { useParams } from "react-router";

import {Login, Logout, Register} from './Authentication.js';


export function AppNavbar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-5">
      <Container>
        <Navbar.Brand href="/">Inventory Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/inventories">Inventories</Nav.Link>
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

function Inventory() {
  let params = useParams();
  const inventoryId = params.id;
  
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [inventory, setInventory] = useState({});

  const context = useContext(authContext);
  const inventories = context.inventories;
  const setInventories = context.setInventories;

  const getInventories = () => {
    GetInventories(context.bearerToken, setInventories);
  }

  const getInventory = () => {
    GetInventory(context.bearerToken, inventoryId, setInventory);
  }

  const getInventoryContents = async () => {
    GetInventoryContents(context.bearerToken, inventoryId, setItems);
  }

  const deleteItem = async (item) => {
    DeleteItem(context.bearerToken, item.id, items, setItems);
  }

  const createItem = async () => {
    let item = {
      'name': itemName,
      'description': itemDescription,
      'inventoryId': inventoryId
    }
    CreateItem(context.bearerToken, item, items, setItems);
  }

  const moveItem = async (item, newInventoryId) => {
    MoveItem(context.bearerToken, item, newInventoryId, items, setItems);
  }

  useEffect(() => {
    getInventoryContents();
    getInventories();
    getInventory();
  }, []);

  const inventoryOptions = inventories.map((inventory, _) => {
    return (
      <option key={inventory.id} value={inventory.id}>{inventory.name}</option>
    )
  });

  const inventoryItems = items.map((item, _) => {
    return (
      <Col key={item.id}>
        <Card>
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>
              {item.description}
            </Card.Text>
            <Button
              variant="primary"
              onClick={() => deleteItem(item)}
            >Delete</Button>
            
            <Form.Select
              aria-label="Default select example"
              id={"move_item_" + item.id}
            >
              <option value="" hidden>Move to other inventory</option>
              {inventoryOptions}
            </Form.Select>
            <Button
              variant="primary"
              onClick={() => moveItem(item, document.getElementById("move_item_" + item.id).value)}
            >Move</Button>
          </Card.Body>
        </Card>
      </Col>
    )
  });
  
  return (
    <>
    <Container fluid>
      <Row>
        <Col className="text-center" >
          <h3>{inventory.name}</h3>
        </Col>
      </Row>
      <Row>
        {inventoryItems}
      </Row>
      <Stack gap={3} className="col-xxl-2 offset-xxl-5 col-md-4 offset-md-4">
        <div className="text-center">
          <h3>Create Item</h3>
        </div>
        <div>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="itemName"
            onChange={(e) => {
              setItemName(e.target.value);
            }}
          />
        </div>
        <div>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="itemDescription"
            onChange={(e) => {
              setItemDescription(e.target.value);
            }}
          />
        </div>
        <div className="d-grid gap-2">
          <Button
            onClick={() => {
              createItem();
            }}
          >Create</Button>
        </div>
      </Stack>
    </Container>
    </>
  )
}


function Inventories() {
  const [inventoryName, setInventoryName] = useState("");
  const [inventoryDescription, setInventoryDescription] = useState("");

  const context = useContext(authContext);

  const inventories = context.inventories;
  const setInventories = context.setInventories;

  const createInventory = async () => {
    let inventory = {
      'name': inventoryName,
      'description': inventoryDescription
    };
    CreateInventory(context.bearerToken, inventory, inventories, setInventories);
  };

  const deleteInventory = async (inventory) => {
    DeleteInventory(context.bearerToken, inventory.id, inventories, setInventories);
  }

  useEffect(() => {

  }, []);

  const inventoryList = inventories.map((inventory, inventoryIndex) => {
    return (
      <Col key={inventoryIndex}>
      <Card>
        <Card.Body>
          <Card.Title>{inventory.name}</Card.Title>
          <Card.Text>
            {inventory.description}
          </Card.Text>
          <a href={"/inventory/" + inventory.id}>
          <Button variant="primary">View</Button>
          </a>
          <Button
            variant="warning"
            onClick={() => deleteInventory(inventory)}
          >Delete</Button>
        </Card.Body>
      </Card>
      </Col>
    )
  });

  return (
    <>
      <Container fluid>
        <Row xs={1} md={2} className="g-4">
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
          <Route exact path="/inventories" element={<PrivateRoute />} >
            <Route exact path="/inventories" element={<Inventories />} />
          </Route>
          <Route exact path="/inventory/:id" element={<PrivateRoute />} >
            <Route exact path="/inventory/:id" element={<Inventory />} />
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
