'use client';

import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { Rio } from '@prisma/client';

interface Props {
  rioList: Rio [];
}

const RIOCardDisplay: React.FC<Props> = ({ rioList }: { rioList: any [] }) => {
  const [selectedRio, setSelectedRio] = useState<any | null>(null);

  return (
    <>
      {rioList.map((rio) => (
        <Col key={rio.id}>
          <Button
            style={{ cursor: 'pointer', all: 'unset', display: 'block' }}
            onClick={() => setSelectedRio(rio)}
          >
            <div className="trending-card">
              <h5 className="trending-card-title">{rio.name}</h5>
              <p className="trending-card-text">{rio.purposeStatement}</p>
            </div>
          </Button>
        </Col>
      ))}

      <Modal
        show={selectedRio !== null}
        onHide={() => setSelectedRio(null)}
        centered
      >
        <Modal.Header closeButton>
          <Row>
            <Modal.Title>{selectedRio?.name}</Modal.Title>
            <h6 className="py-1">{selectedRio?.type}</h6>
          </Row>
        </Modal.Header>

        <Modal.Body>
          <p>{selectedRio?.purposeStatement}</p>
          Main Contact:&nbsp;
          {selectedRio?.mainContact}
          <div className="py-2" />
          Email:&nbsp;
          {selectedRio?.email}
          <br />
          <br />
          <Row className="justify-content-center" md={3}>
            <Button variant="success">
              <a href={`mailto:${selectedRio?.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
            </Button>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RIOCardDisplay;
