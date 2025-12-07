'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Modal, Row, Toast, ToastContainer } from 'react-bootstrap';
import { Bookmark, BookmarkCheckFill, BookmarkFill, Envelope, Trash3 } from 'react-bootstrap-icons';
import { RioType } from '@/lib/dbActions';
import { useSession } from 'next-auth/react';

type Props = {
  rioList: RioType[];
  role?: string | null;
  currentUser?: any;
};

const RioCardDisplay: React.FC<Props> = ({ rioList, role: propRole, currentUser: propCurrentUser }: Props) => {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const role = propRole ?? (session?.user as any)?.role ?? null;
  const currentUser = propCurrentUser ?? session?.user?.email ?? null;

  // Store only the IDs of bookmarked RIOs
  const [userBookmarkIds, setUserBookmarkIds] = useState<number[]>([]);
  const [selectedRio, setSelectedRio] = useState<RioType | null>(null);
  // toast is the notification that will display when user bookmarks
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch user's bookmarks on load
  useEffect(() => {
    async function fetchBookmarks() {
      const res = await fetch('/api/bookmarks/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log('Bookmarks from API:', data);

      // Normalize response to number[] (support numbers, array of objects, or wrapper)
      let ids: number[] = [];
      if (Array.isArray(data)) {
        if (data.length === 0) ids = [];
        else if (typeof data[0] === 'number') {
          ids = data as number[];
        } else if (typeof data[0] === 'object') {
          ids = data.map((d: any) => Number(d.rioId ?? d.id ?? d.rio?.id ?? d)).filter(Boolean);
        }
      } else if (data && typeof data === 'object') {
        if (Array.isArray((data as any).ids)) ids = (data as any).ids.map(Number);
      }

      setUserBookmarkIds(ids);
    }

    if (email) {
      fetchBookmarks();
    }
  }, [email]);

  // Toggle bookmark
  const toggleBookmark = async (rioId: number) => {
    if (!email) return;

    try {
      const res = await fetch('/api/bookmarks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, rioId }),
      });

      const data = await res.json();

      if (data.bookmarked === true) {
        setUserBookmarkIds((prev) => [...prev, rioId]);
        setToastMessage('Added to bookmarks!');
        setShowToast(true);
      } else {
        setUserBookmarkIds((prev) => prev.filter((id) => id !== rioId));
        setToastMessage('Removed from bookmarks!');
        setShowToast(true);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      setToastMessage('Error updating bookmark');
      setShowToast(true);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2000}
          autohide
          bg={toastMessage.includes('Error') ? 'danger' : 'success'}
        >
          <Toast.Header>
            <strong className="me-auto white">Bookmark</strong>
          </Toast.Header>
          <Toast.Body className={toastMessage.includes('Error') ? 'text-white' : ''}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {rioList.map((rio) => {
        const isBookmarked = userBookmarkIds.includes(rio.id);

        return (
          <Col key={rio.id} md={4}>
            <Card
              className="trending-card"
              style={{ position: 'relative', paddingBottom: 30 }} // room for the Edit button
            >
              <Row>
                <Col sm={2}>
                  {email && (
                    <Button style={{ cursor: 'pointer', all: 'unset' }} onClick={() => toggleBookmark(rio.id)}>
                      {isBookmarked ? <BookmarkCheckFill /> : <Bookmark />}
                    </Button>
                  )}
                </Col>
              </Row>

              <Button style={{ cursor: 'pointer', all: 'unset' }} onClick={() => setSelectedRio(rio)}>
                <h5 className="trending-card-title">{rio.name}</h5>
                <p className="text-muted mb-1 text-center">{rio.interest.name}</p>
                <CardBody>
                  <p className="trending-card-text">{rio.purposeStatement}</p>
                </CardBody>
              </Button>
              {currentUser && role === 'ADMIN' && (
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // don't open the card modal
                    window.location.href = `/editRio/${rio.id}`;
                  }}
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    zIndex: 10,
                  }}
                >
                  Edit
                </Button>
              )}
            </Card>
          </Col>
        );
      })}

      {/* Modal */}
      <Modal
        show={selectedRio !== null}
        onHide={() => setSelectedRio(null)}
        centered
        size="xl" // react-bootstrap sizes: sm, lg, xl
        dialogClassName="modal-90w" // custom class to further control width
      >
        <Modal.Header closeButton>
          <Row>
            <Modal.Title>{selectedRio?.name ?? ''}</Modal.Title>
            <h6 className="py-1">{selectedRio?.interest?.name ?? ''}</h6>
          </Row>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div
              className="text-dark border border-black rounded px-2 py-2"
              style={{ color: 'inherit', backgroundColor: '#ffffff' }}
            >
              <BookmarkFill size={20} className="me-1" />
              {selectedRio?.bookmarks ?? 0}
            </div>
            {currentUser && role === 'ADMIN' ? (
              <Button
                variant="outline-warning"
                onClick={(e) => {
                  e.stopPropagation();
                  // navigate to edit page
                  if (selectedRio?.id) window.location.href = `/editRio/${selectedRio.id}`;
                }}
              >
                Edit
              </Button>
            ) : (
              ''
            )}
          </div>
          <br />
          <Row className="justify-content-between">
            <Col xs={12} md={11} lg={8}>
              <strong>Purpose Statement:</strong>
              <p>{selectedRio?.purposeStatement}</p>
            </Col>
            <Col xs={7} md={6} lg={4}>
              <strong>Main Contact:&nbsp;</strong>
              {selectedRio?.mainContact}
              <br />
              <strong>Email:&nbsp;</strong>
              {selectedRio?.email}
              <br />
              <strong>Approved:&nbsp;</strong>
              {selectedRio?.approvalDate ? new Date(selectedRio.approvalDate).toDateString() : ''}
              <br />
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-start align-items-end">
              {currentUser && role === 'ADMIN' ? (
                <Button
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    // navigate to delete page
                    if (selectedRio?.id) window.location.href = `/deleteRio/${selectedRio.id}`;
                  }}
                >
                  Delete <Trash3 />
                </Button>
              ) : (
                ''
              )}
            </Col>
            <Col className="d-flex justify-content-end">
              <Button variant="outline-primary" size="lg" className="mt-3">
                <a href={`mailto:${selectedRio?.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Envelope size={25} />
                </a>
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

RioCardDisplay.defaultProps = {
  role: null,
  currentUser: null,
};

export default RioCardDisplay;
