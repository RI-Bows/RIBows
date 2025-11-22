'use client';

import { useState } from 'react';
import { Form, Button, Card, Toast, ToastContainer } from 'react-bootstrap';

const interestOptions = [
  'Academic / Professional',
  'Leisure / Recreational',
  'Arts / Culture',
  'Sports',
  'Volunteering',
  'Other',
];

export default function EditClubForm({ rio }: { rio: any }) {
  const [name, setName] = useState(rio.name);
  const [purposeStatement, setPurposeStatement] = useState(rio.purposeStatement || '');
  const [type, setType] = useState(rio.type);
  const [mainContact, setMainContact] = useState(rio.mainContact);
  const [email, setEmail] = useState(rio.email);
  const [interests, setInterests] = useState(
    rio.RioInterest.map((i: any) => i.interestName),
  );

  const handleInterestsChange = (e: any) => {
    const selected = Array.from(e.target.selectedOptions as HTMLOptionElement[]).map(o => o.value);
    setInterests(selected);
  };

  const [showToast, setShowToast] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch(`/api/rio/${rio.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        purposeStatement,
        type,
        mainContact,
        email,
        interests,
      }),
    });
    setShowToast(true);
  };

  return (
    <Card className="p-3 mb-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>RIO Name</Form.Label>
          <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Purpose Statement</Form.Label>
          <Form.Control value={purposeStatement} onChange={(e) => setPurposeStatement(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Type</Form.Label>
          <Form.Control value={type} onChange={(e) => setType(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Main Contact</Form.Label>
          <Form.Control value={mainContact} onChange={(e) => setMainContact(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Interests</Form.Label>
          <Form.Select multiple value={interests} onChange={handleInterestsChange}>
            {interestOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button className="mt-3" type="submit">Save Changes</Button>
      </Form>
      <ToastContainer position="bottom-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>RIO updated!</Toast.Body>
        </Toast>
      </ToastContainer>
    </Card>
  );
}
