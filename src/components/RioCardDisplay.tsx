'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Modal, Row, Toast, ToastContainer } from 'react-bootstrap';
import { Bookmark, BookmarkCheckFill } from 'react-bootstrap-icons';
import { RioType } from '@/lib/dbActions';
import { useSession } from 'next-auth/react';

type Props = {
  rioList: RioType[];
};

const RIOCardDisplay: React.FC<Props> = ({ rioList }: Props) => {
  const { data: session } = useSession();
  const email = session?.user?.email;

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
      // convert RIO objects → array of IDs
      setUserBookmarkIds(data);
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
          <Toast.Body className={toastMessage.includes('Error') ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {rioList.map((rio) => {
        const isBookmarked = userBookmarkIds.includes(rio.id);

        return (
          <Col key={rio.id} md={4}>
            <Card className="trending-card">
              <Row>
                <Col sm={2}>
                  {email && (
                    <Button
                      style={{ cursor: 'pointer', all: 'unset' }}
                      onClick={() => toggleBookmark(rio.id)}
                    >
                      {isBookmarked ? <BookmarkCheckFill /> : <Bookmark />}
                    </Button>
                  )}
                </Col>
              </Row>

              <Button
                style={{ cursor: 'pointer', all: 'unset' }}
                onClick={() => setSelectedRio(rio)}
              >
                <h5 className="trending-card-title">{rio.name}</h5>
                <p className="text-muted mb-1 text-center">
                  {rio.interest.name}
                </p>
                <CardBody>
                  <p className="trending-card-text">{rio.purposeStatement}</p>
                </CardBody>
              </Button>
            </Card>
          </Col>
        );
      })}

      {/* Modal */}
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
