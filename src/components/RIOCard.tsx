'use client';

import { Button, Card } from 'react-bootstrap';

type RIO = {
  name: string;
  type: string;
  main_contact: string;
  email: string;
  description: string;
};

/* Renders a single RIO card. */
const RIOCard = ({ name, type, main_contact, email, description }: RIO) => (
  <Card className="h-100">
    <Card.Header className="bg-success text-white">
      <Card.Title>{name}</Card.Title>
      <Card.Subtitle>{type}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>{description}</Card.Text>
      <Card.Text>
        Main Contact:
        &nbsp;
        {main_contact}
      </Card.Text>
      <Button variant="success">
        <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
      </Button>
    </Card.Body>
  </Card>
);

export default RIOCard;
