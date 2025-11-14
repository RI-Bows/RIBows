'use client';

import { Card, Image } from 'react-bootstrap';

type RIO = {
  firstName: string;
  lastName: string;
  image: string;
  address: string;
  description: string;
};

/* Renders a single RIO card. */
const RIOCard = ({ firstName, lastName, image, address, description }: RIO) => (
  <Card className="h-100">
    <Card.Header>
      <Image src={image} width={75} alt={`${firstName} ${lastName}`} />
      <Card.Title>
        {firstName}
        &nbsp;
        {lastName}
      </Card.Title>
      <Card.Subtitle>{address}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>{description}</Card.Text>
    </Card.Body>
  </Card>
);

export default RIOCard;
