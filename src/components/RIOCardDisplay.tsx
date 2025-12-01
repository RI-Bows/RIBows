'use client';

import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { RioType } from '@/lib/dbActions';

type Props = {
  rioList: RioType[];
};

const RIOCardDisplay: React.FC<Props> = ({ rioList }: Props) => {
  const [selectedRio, setSelectedRio] = useState<RioType | null>(null);

  return (
    <>
      {rioList.map((rio) => (
        <Col key={rio.id} md={4}>
          <Button
            style={{ cursor: 'pointer', all: 'unset', display: 'block' }}
            onClick={() => setSelectedRio(rio)}
          >
            <div className="trending-card h-100">
              <h5 className="trending-card-title">{rio.name}</h5>
              <p className="text-muted mb-1 text-center">{rio.interest.name}</p>
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
            <h6 className="py-1">{selectedRio?.interest.name}</h6>
          </Row>
        </Modal.Header>

        <Modal.Body>
          {`Bookmarks: ${selectedRio?.bookmarks}`}
          <br />
          <br />
          <p>{selectedRio?.purposeStatement}</p>
          Main Contact:&nbsp;
          {selectedRio?.mainContact}
          <div className="py-2" />
          Email:&nbsp;
          {selectedRio?.email}
          <br />
          {`Approved: ${selectedRio?.approvalDate.toDateString()}`}
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
