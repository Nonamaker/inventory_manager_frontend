import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

import { useState } from 'react';
import {Card, Col, Container, Row, Stack, Form, Button} from 'react-bootstrap';

export const db = new Dexie('myDatabase');
db.version(1).stores({
    users: '++id, name'
});


export function AddUserForm() {
    const [name, setName] = useState('');

    async function handleCreateUser() {
        try {
            const id = await db.users.add({
                name
            })
            console.log(id);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container>
            <Stack gap={3} className="col-xxl-2 offset-xxl-5 col-md-4 offset-md-4">
            <div className="text-center">
            <h3>Create User</h3>
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
            </div>
        </Stack>
        </Container>
    )
}

export function UserList() {
    const users = useLiveQuery(() => db.users.toArray());

    return (
        <Container fluid className="mt-5">
          <Row xs={1} md={2} className="g-4">
            {users?.map((user) => (
                <Col key={user.pk}>
                <Card>
                <Card.Body>
                    <Card.Title>{user.name}</Card.Title>
                    <Card.Text>
                    example text
                    </Card.Text>
                    <Button
                    variant="warning"
                    >Delete</Button>
                </Card.Body>
                </Card>
                </Col>
            ))}
          </Row>
        </Container>
    )
}