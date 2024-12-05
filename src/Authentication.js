import { useState, useContext, useEffect } from 'react';

import { useLiveQuery } from 'dexie-react-hooks';

import { Alert, Button, Card, Container, Form, InputGroup, Modal, Stack } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from "react-router";

import { getCookieByName } from './utils.js';
import { authContext } from './contexts';
import { AppNavbar } from './App.js';
import { db } from './db.js';


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
      process.env.REACT_APP_AUTH_API + 'register',
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
    <AppNavbar />
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
          <Button variant="secondary"
            onClick={CreateLocalAccount}
          >Create an Offline Account</Button>
          <Form.Text className="text-muted">
            Already have an account? <a href="#/" onClick={() => navigate("/login")}>Login</a> or <a href="#/" onClick={() => navigate("/select-local-account")}>offline account</a>
          </Form.Text>
        </div>
        <ErrorSection />  
      </Stack>
    </Container>
    </>
  )
}

export function CreateLocalAccount() {
  const [name, setName] = useState('');

  const navigate = useNavigate();
  const context = useContext(authContext);

  async function handleCreateUser() {
      try {
          const id = await db.users.add({name});
          context.setUser(await db.users.get(id));
          navigate("/");
      } catch (error) {
          console.log(error);
      }
  }

  return (
      <>
      <AppNavbar />
      <Container fluid>
        <Stack gap={3} className="col-xxl-2 offset-xxl-5 col-md-4 offset-md-4">
          <div className="text-center">
            <h3>Create Local User</h3>
          </div>
          <div>
            <Form.Label>Name</Form.Label>
            <Form.Control
                type="text"
                name="userName"
                onChange={(e) => {
                    setName(e.target.value);
                }}
            />
          </div>
          <div className="d-grid gap-2">
            <Button
                onClick={handleCreateUser}
            >Create</Button>
            <Form.Text className="text-muted">
              Local account data is stored completely in the browser and will be deleted if site data is deleted. Local accounts are not secured and can be accessed by anyone with access to your computer.
            </Form.Text>
          </div>
        </Stack>
      </Container>
      </>
  )
}

function attemptLogin(email, password, context, navigate){
  fetch(
    process.env.REACT_APP_AUTH_API + 'login',
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
        document.cookie = "bearerToken="+data.accessToken+";Max-Age="+data.expiresIn;
        document.cookie = "refreshToken="+data.refreshToken;
        context.setAuthenticated(true);
        context.setUser(email);
        context.setIsLocalUser(false);
        navigate("/");
    }
  });
}

export function fetchRetry(originalFetch) {
  /* Attempts to refresh the access token if the initial fetch fails */

  function refreshAccessToken(onSuccess) {
    console.log("Refreshing access token.");
    console.log("Old token: " + getCookieByName("bearerToken"));
    fetch(
      process.env.REACT_APP_AUTH_API + 'refresh',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: getCookieByName("refreshToken")
        })
      }
    ).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        document.cookie = "bearerToken="+data.accessToken+";Max-Age="+data.expiresIn;
        document.cookie = "refreshToken="+data.refreshToken;
        console.log("New token: " + getCookieByName("bearerToken"));
        onSuccess();
      } else {
        console.log(response);
      }
    });
  }

  let attemptsRemaining = 1;

  originalFetch((error) => {
    console.log(error);
    if (attemptsRemaining > 0) {
      refreshAccessToken(originalFetch);
    }
    attemptsRemaining = 0;
  });

}

export function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const context = useContext(authContext);
  const navigate = useNavigate();

  // If a bearerToken cookie is present, check to see if it still works. If not,
  // check if the refreshToken is present and works. If either work, authenticate
  // user and redirect away from login page.
  useEffect(() => {
    if (context.user !== "") {
      navigate("/inventories");
    }
  // eslint-disable-next-line
  }, [context.user])

  return (
    <>
      <AppNavbar />
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
                attemptLogin(email, password, context, navigate);
              }}
            >Login</Button>
            <Button variant="secondary"
              onClick={() => navigate("/select-local-account")}
            >Use an Offline Account</Button>
            <Form.Text className="text-muted">
              Don't have an account? <a href="#/" onClick={() => navigate("/register")}>Register</a> or <a href="#/" onClick={() => navigate("/create-local-account")}>create an offline account</a>.
            </Form.Text>
          </div>
        </Stack>
      </Container>
    </>
  )
}

export function SelectLocalAccount() {

  const users = useLiveQuery(() => db.users.toArray());
  const [selectedUser, setSelectedUser] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const context = useContext(authContext);
  const navigate = useNavigate();

  const handleClickDelete = (user) => {
    setShowDeleteModal(true);
    setSelectedUser(user);
  }

  const handleClickDeleteConfirm = async () => {
    setShowDeleteModal(false);
    // Delete all items and inventories, then the user
    const inventories = await db.inventories.where({ownerId: selectedUser.id}).toArray();
    const items = await db.items.where('inventoryId').anyOf(
      inventories.map((inventory) => {return inventory.id})
    ).toArray()
    
    db.items.bulkDelete(items.map((item) => {return item.id}));
    db.inventories.bulkDelete(items.map((inventory) => {return inventory.id}));
    db.users.where({id: parseInt(selectedUser.id)}).delete()
  }

  const handleAbortDeleteConfirm = () => {
    setShowDeleteModal(false);
  }

  return (
    <>
    <AppNavbar />

    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete User</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to permanently delete "{selectedUser.name}"?</Modal.Body>
      <Modal.Footer>
          <Button onClick={handleAbortDeleteConfirm}>Go Back</Button>
          <Button onClick={handleClickDeleteConfirm} variant="danger">Delete</Button>
      </Modal.Footer>
    </Modal>

    <Container fluid>
      <Stack gap={3} className="col-xxl-2 offset-xxl-5 col-md-4 offset-md-4">
        {users?.length > 0 ?
          users.map((user) => (
            <Card key={user.id}>
                <Card.Header className="d-flex">
                  {user.name}
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => handleClickDelete(user)}
                    className="ms-auto"
                  />
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                    example text
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button
                    variant="primary"
                    onClick={() => {
                      context.setUser(user);
                      navigate("/")
                    }}
                  >Select</Button>
                </Card.Footer>
            </Card>
          ))
        :
          <div className="d-grid gap-2">
            <Button variant="primary"
              onClick={() => navigate("/create-local-account")}
            >Create an Offline Account</Button>
          </div>
        }
      </Stack>
    </Container>
    </>
  )
}

export function Logout() {

  const context = useContext(authContext);
  const navigate = useNavigate();
  
  // PICK UP HERE
  // this mounts after the context so the bearer token isn't getting cleared until
  //  after it initializes again.

  useEffect(() => {
    console.log("Log out")
    // TODO Handle this cleanup in the context itself?
    context.setAuthenticated(false);
    context.setBearerToken("");
    context.setUser("");
    context.setIsLocalUser(false)
    document.cookie = "bearerToken=;Max-Age:0";
    document.cookie = "refreshToken=;Max-Age:0";
    // Un-cache everything when user changes
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
    navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
}

