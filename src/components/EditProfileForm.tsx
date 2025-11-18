/* eslint-disable arrow-body-style */

'use client';

import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const interestOptions = [
  'Academic / Professional',
  'Leisure / Recreational',
  'Arts / Culture',
  'Sports',
  'Volunteering',
  'Other',
];

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: any) => void;
  placeholder: string;
}) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control value={value} onChange={onChange} placeholder={placeholder} />
    </Form.Group>
  );
}

export default function EditProfileForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  const handleInterestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected: string[] = Array.from(e.target.selectedOptions).map((o) => o.value);
    setInterests(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ firstName, lastName, interests });
  };

  return (
    <Card className="p-3">
      <Form onSubmit={handleSubmit}>
        <InputField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter first name"
        />

        <InputField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter last name"
        />

        <Form.Group className="mb-3">
          <Form.Label>Club Interests</Form.Label>
          <Form.Select multiple value={interests} onChange={handleInterestsChange}>
            {interestOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Form.Select>
          <Form.Text className="text-muted">Hold Cmd/Ctrl to select multiple.</Form.Text>
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center">
          <Button variant="primary" type="submit">
            Save
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setFirstName('');
              setLastName('');
              setInterests([]);
            }}
          >
            Reset
          </Button>
        </div>
      </Form>

      <Card className="mt-3 p-3">
        <h5>Preview</h5>
        <p>
          <strong>Name:</strong>
          &nbsp;
          {firstName || '—'}
          &nbsp;
          {lastName || ''}
        </p>
        <p>
          <strong>Interests:</strong>
          &nbsp;
          {interests.length ? interests.join(', ') : '—'}
        </p>
      </Card>
    </Card>
  );
}
