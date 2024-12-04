import { useEffect, useState, useContext } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Card, Row, Col, Stack, Form, Button, Modal} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';

import { BrowserRouter, Routes, Route, useNavigate } from "react-router";

import { authContext } from './contexts';
import { PrivateRoute } from './PrivateRoute.js';
import { Game } from './Game.js';
import { CreateInventory, CreateItem, DeleteInventory, DeleteItem, GetInventories, GetInventory, GetInventoryContents, MoveItem } from './InventoryAPI.js';

import { useParams } from "react-router";

import {Login, Logout, Register, CreateLocalAccount, SelectLocalAccount} from './Authentication.js';


export function AppNavbar() {
  const navigate = useNavigate();
  const context = useContext(authContext);
  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-5">
      <Container>
        <Navbar.Brand>&nbsp;Inventory Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              onClick={() => navigate("/inventories")}
            >
              Inventories
            </Nav.Link>
            {context.user !== "" ?
              <NavDropdown title="Profile" id="basic-nav-dropdown">
                <NavDropdown.Item>{context.user.name}</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => navigate("/logout")}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
              : null
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}


function Inventory() {
  
  console.log("Rendering Inventory. ")

  useEffect(() => {
    console.log("Mounting Inventory.");
  }, []);

  let params = useParams();
  const inventoryId = params.id;
  
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [inventory, setInventory] = useState({});
  const [items, setItems] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [newLocationId, setNewLocationId] = useState("");

  const [selectedItem, setSelectedItem] = useState("");

  const context = useContext(authContext);

  const getInventory = () => {
    GetInventory(inventoryId, setInventory);
  }

  const getInventoryContents = async () => {
    GetInventoryContents(inventoryId, setItems);
  }

  useEffect(() => {
    GetInventories(context, setInventories);
    // eslint-disable-next-line
  }, [])

  const createItem = async () => {
    let item = {
      'name': itemName,
      'description': itemDescription,
      'inventoryId': parseInt(inventoryId)
    }
    CreateItem(item, items, setItems);
  }

  const handleClickDelete = (item) => {
    setShowDeleteModal(true);
    setSelectedItem(item);
  }

  const handleClickDeleteConfirm = () => {
    setShowDeleteModal(false);
    DeleteItem(selectedItem.id, items, setItems);
  }

  const handleAbortDeleteConfirm = () => {
    setShowDeleteModal(false);
  }

  const handleClickMove = (item) => {
    setShowMoveModal(true);
    setSelectedItem(item);
  }

  const handleClickMoveConfirm = () => {
    setShowMoveModal(false);
    MoveItem(selectedItem, newLocationId, items, setItems);
  }

  useEffect(() => {
    getInventoryContents();
    getInventory();
    // eslint-disable-next-line
  }, []);

  const inventoryOptions = inventories.map((inventoryOption, _) => {
    // Don't include the current inventory in the 'Move' options.
    if (inventoryOption.id === inventory.id) { return null; }
    return (
      <option key={inventoryOption.id} value={inventoryOption.id}>{inventoryOption.name}</option>
    )
  });

  const inventoryItems = items.map((item, _) => {
    return (
      <Row key={item.id} className="mt-5">
        <Col>
          <Card>
            <Card.Header className="d-flex">
              {item.name}
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleClickDelete(item)}
                className="ms-auto"
              />
            </Card.Header>
            <Card.Body>
              <Card.Text>
                {item.description}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex">
              <FontAwesomeIcon
                icon={faShareFromSquare}
                onClick={() => handleClickMove(item)}
                className="ms-auto"
              />
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    )
  });
  
  return (
    <>
    <AppNavbar />

    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to permanently delete "{selectedItem.name}"?</Modal.Body>
      <Modal.Footer>
          <Button onClick={handleAbortDeleteConfirm}>Go Back</Button>
          <Button onClick={handleClickDeleteConfirm} variant="danger">Delete</Button>
      </Modal.Footer>
    </Modal>

    <Modal show={showMoveModal} onHide={() => setShowMoveModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Moving "{selectedItem.name}" to {newLocationId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Select
          onChange={(e) => {setNewLocationId(e.target.value);}}
        >
          <option value="" hidden>Select Destination</option>
          {inventoryOptions}
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={handleClickMoveConfirm}>Move</Button>
      </Modal.Footer>
    </Modal>

    <Container fluid>
      <Row>
        <Col className="text-center">
          <h3>{inventory.name}</h3>
        </Col>
      </Row>
      <Row>
        <Col lg={{span: 6, offset: 3}}>
          {inventoryItems}
        </Col>
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

  console.log("Rendering Inventories. ")

  useEffect(() => {
    console.log("Mounting Inventories.");
  }, []);

  const [inventoryName, setInventoryName] = useState("");
  const [inventoryDescription, setInventoryDescription] = useState("");
  const [inventories, setInventories] = useState([]);

  const navigate = useNavigate();
  const context = useContext(authContext);

  useEffect(() => {
    GetInventories(context, setInventories);
    // eslint-disable-next-line
  }, []);

  const createInventory = async () => {
    let inventory = {
      'name': inventoryName,
      'description': inventoryDescription,
      'ownerId': context.user.id
    };
    CreateInventory(inventory, inventories, setInventories);
  };

  const deleteInventory = async (inventoryId) => {
    DeleteInventory(context, inventoryId, inventories, setInventories);
  }

  const inventoryList = inventories.map((inventory, inventoryIndex) => {
    return (
      <Col key={inventoryIndex}>
      <Card>
        <Card.Body>
          <Card.Title>[{inventory.id}] {inventory.name}</Card.Title>
          <Card.Text>
            {inventory.description}
          </Card.Text>
          <Button
            variant="primary"
            onClick={() => navigate("/inventory/" + inventory.id)}
          >View</Button>
          <Button
            variant="warning"
            onClick={() => deleteInventory(inventory.id)}
          >Delete</Button>
        </Card.Body>
      </Card>
      </Col>
    )
  });

  return (
    <>
      <AppNavbar />
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


export function App() {
  console.log("Rendering App.")
  useEffect(() => {
    console.log("Mounting App.");
  }, []);

  return (
        <>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<PrivateRoute />} >
              <Route exact path="/" element={<Inventories />} />
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
            <Route path="/create-local-account" element={<CreateLocalAccount />} />
            <Route path="/select-local-account" element={<SelectLocalAccount />} />
          </Routes>
        </BrowserRouter>
        </>
  )
}
