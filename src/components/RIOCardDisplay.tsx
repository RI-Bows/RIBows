'use client';

import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
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
          <div style={{ position: 'relative' }}>
            {/* clickable card */}
            <div
              className="trending-card"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedRio(rio)}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedRio(rio); }}
              style={{ display: 'block', cursor: 'pointer' }}
            >
              <h5 className="trending-card-title">{rio.name}</h5>
              <p className="text-muted mb-1 text-center">{rio.interest?.name ?? ''}</p>
              <p className="trending-card-text">{rio.purposeStatement}</p>
            </div>

            {currentUser && role === 'ADMIN' ? (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // navigate to edit page - replace with router if you prefer client routing
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
          {`Bookmarks: ${selectedRio?.bookmarks ?? 0}`}
          <br />
          <br />
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
