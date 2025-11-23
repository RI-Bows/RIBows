'use client';

import { Card } from 'react-bootstrap';
import { Envelope, Linkedin } from 'react-bootstrap-icons';

type Member = {
  name: string;
  year: string;
  email: string;
  linkedin: string;
  image: string;
};

/* Renders a single Member card. The entire card links to the member's LinkedIn. */
const MemberCard = ({ name, year, email, linkedin, image }: Member) => (
  <Card className="h-100">
    {image && (
      <Card.Img variant="top" src={image} alt={`${name} headshot`} style={{ objectFit: 'cover', height: '200px' }} />
    )}

    <Card.Header className="bg-light">
      <Card.Title>{name}</Card.Title>
      <Card.Subtitle>{year}</Card.Subtitle>
    </Card.Header>
    <Card.Body className="d-flex justify-content-start align-items-start px-3">
      <a href={`mailto:${email}`} aria-label={`Email ${name}`} className="text-reset me-3">
        <Envelope size={20} />
      </a>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name}'s LinkedIn`}
        className="text-reset"
      >
        <Linkedin size={20} />
      </a>
    </Card.Body>
  </Card>
);

export default MemberCard;
