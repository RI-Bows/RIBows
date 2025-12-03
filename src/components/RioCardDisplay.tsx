'use client';

import { useState } from 'react';
import { Button, Card, CardBody, Col, Modal, Row } from 'react-bootstrap';
import { RioType } from '@/lib/dbActions';
import { useSession } from 'next-auth/react';

type Props = {
  rioList: RioType[];
  // pass the signed-in user role (or compute isAdmin in parent)
  role?: string | null;
  currentUser?: any;
};

const RIOCardDisplay: React.FC<Props> = ({
  rioList, role: propRole, currentUser: propCurrentUser }: Props) => {
  // move hook inside component body (hooks must be called from React components)
  const { data: session } = useSession();

  // prefer explicit props, fallback to session values
  const role = propRole ?? (session?.user as any)?.role ?? null;
  const currentUser = propCurrentUser ?? session?.user?.email ?? null;

  const [selectedRio, setSelectedRio] = useState<RioType | null>(null);

  return (
    <>
      {rioList.map((rio) => (
        <Col key={rio.id} md={4}>
          <Button
            style={{ cursor: 'pointer', all: 'unset', display: 'flex', width: '100%', height: '100%' }}
            onClick={() => setSelectedRio(rio)}
          >
            <Card className="trending-card ">
              <h5 className="trending-card-title">{rio.name}</h5>
              <p className="text-muted mb-1 text-center">{rio.interest.name}</p>
              <CardBody>
                <p className="trending-card-text">{rio.purposeStatement}</p>
              </CardBody>
              <div style={{ position: 'relative' }}>
                {currentUser && role === 'ADMIN' ? (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // navigate to edit page
                      window.location.href = `/editRio/${rio.id}`;
                    }}
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      zIndex: 10,
                    }}
                  >
                    Edit
                  </Button>
                ) : ('')}
              </div>
            </Card>
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
            <h6 className="py-1">{selectedRio?.interest?.name ?? ''}</h6>
          </Row>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <p>
              {`Bookmarks: ${selectedRio?.bookmarks ?? 0}`}
            </p>
            {currentUser && role === 'ADMIN' ? (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // navigate to edit page
                  window.location.href = `/editRio/${selectedRio.id}`;
                }}
              >
                Edit
              </Button>
            ) : ('')}
          </div>
          <p>{selectedRio?.purposeStatement}</p>
          Main Contact:&nbsp;
          {selectedRio?.mainContact ?? ''}
          <div className="py-2" />
          Email:&nbsp;
          {selectedRio?.email ?? ''}
          <br />
          {`Approved: ${selectedRio?.approvalDate.toDateString()}`}
          <br />
          <br />
          <Row className="justify-content-center" md={3}>
            <Button variant="success" as="a" href={`mailto:${selectedRio?.email ?? ''}`}>
              Contact
            </Button>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

RIOCardDisplay.defaultProps = {
  role: null,
  currentUser: null,
};

export default RIOCardDisplay;
