'use client';

import { RioType } from '@/lib/dbActions';
import { Button, Card } from 'react-bootstrap';

/* Renders a single RIO card. */
const RioCard = ({ rio }: { rio: RioType }) => (
  <Card className="h-100">
    <Card.Header className="bg-light">
      <Card.Title>{rio.name}</Card.Title>
      <Card.Subtitle>{rio.interest.name}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>{rio.purposeStatement}</Card.Text>
      <Card.Text>
        Main Contact:&nbsp;
        {rio.mainContact}
      </Card.Text>
      <Card.Text>
        Email:&nbsp;
        {rio.email}
      </Card.Text>
      <Button variant="success">
        <a href={`mailto:${rio.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
      </Button>
    </Card.Body>
  </Card>
);

export default RioCard;
