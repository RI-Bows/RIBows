'use client';

import { useState } from 'react';
import { Card, Image, Row, Col, Button, Toast, ToastContainer } from 'react-bootstrap';

export default function DeleteRioForm({
  rio,
}: {
  rio: any;
}) {
  // Normalize incoming rio interests into a string[] so .map is always safe
  const normalizeInterests = (): string[] => {
    if (Array.isArray(rio?.RioInterest) && rio.RioInterest.length > 0) {
      return rio.RioInterest.map((ri: any) => ri.name ?? ri.interest?.name ?? String(ri));
    }
    if (rio?.interest) {
      return [rio.interest.name ?? String(rio.interest)];
    }
    return [];
  };

  const interests = normalizeInterests();
  const currentImageUrl = rio?.image ?? null;
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const deleteRio = async (id: number) => {
    const res = await fetch('/api/rio/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (data.success) {
      setShowDeleteToast(true);

      // Wait so user can see the toast, THEN go back
      setTimeout(() => {
        window.history.back();
      }, 1200); // 1.2 sec = perfect timing
    }
  };

  return (
    <Card className="p-3 mb-4">
      <Row>
        {/* Left column: display fields */}
        <Col md={7}>
          <div className="mb-2">
            <strong>RIO Name:</strong>
            <div>{rio.name}</div>
          </div>
          <div className="mb-2">
            <strong>Purpose Statement:</strong>
            <div>{rio.purposeStatement}</div>
          </div>
          <div className="mb-2">
            <strong>Main Contact:</strong>
            <div>{rio.mainContact}</div>
          </div>
          <div className="mb-2">
            <strong>Email:</strong>
            <div>{rio.email}</div>
          </div>
          <div className="mb-2">
            <strong>Interests:</strong>
            <div>
              {Array.isArray(interests) && interests.length > 0 ? (
                interests.map((interest: string) => (
                  <span
                    key={interest}
                    className="badge bg-primary mb-1 me-1"
                    style={{ pointerEvents: 'none' }}
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-muted">No interests</span>
              )}
            </div>
          </div>
        </Col>

        {/* Right column: image preview */}
        <Col md={5}>
          <div>
            <strong>RIO Image:</strong>
          </div>
          <div className="mb-2 d-flex justify-content-center">
            {currentImageUrl ? (
              <Image
                src={currentImageUrl}
                alt="RIO image"
                thumbnail
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            ) : (
              <div>No image</div>
            )}
          </div>
        </Col>
        <Row>
          <Col className="d-flex justify-content-start">
            <Button variant="primary" onClick={() => window.history.back()}>
              No
            </Button>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                // navigate to delete page
                if (rio?.id) deleteRio(rio.id);
              }}
            >
              Yes
            </Button>
          </Col>
        </Row>
      </Row>
      <ToastContainer position="middle-center" className="p-3">
        <Toast
          onClose={() => setShowDeleteToast(false)}
          show={showDeleteToast}
          delay={3000}
          autohide
          bg="danger"
        >
          <Toast.Header>
            <strong className="me-auto">Deleted</strong>
          </Toast.Header>
          <Toast.Body className="text-white">RIO deleted successfully.</Toast.Body>
        </Toast>
      </ToastContainer>
    </Card>
  );
}
