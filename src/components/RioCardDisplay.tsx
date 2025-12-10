'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Modal, Row, Toast, ToastContainer, Image } from 'react-bootstrap';
import { Bookmark, BookmarkCheckFill, Envelope, Trash3 } from 'react-bootstrap-icons';
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

  // IDs of RIOs this user has bookmarked
  const [userBookmarkIds, setUserBookmarkIds] = useState<number[]>([]);
  const [selectedRio, setSelectedRio] = useState<RioType | null>(null);

  // toast for bookmark feedback
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // bookmark count shown in the modal pill
  const [rioBookmarks, setRioBookmarks] = useState<number>(0);

  // ---------------- Fetch user's bookmarked IDs ----------------
  useEffect(() => {
    async function fetchUserBookmarks() {
      if (!email) {
        setUserBookmarkIds([]);
        return;
      }

      const res = await fetch('/api/bookmarks/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log('Bookmarks from API:', data);

      let ids: number[] = [];
      if (Array.isArray(data)) {
        if (data.length === 0) ids = [];
        else if (typeof data[0] === 'number') {
          ids = data as number[];
        } else if (typeof data[0] === 'object') {
          ids = data.map((d: any) => Number(d.rioId ?? d.id ?? d.rio?.id ?? d)).filter(Boolean);
        }
      } else if (data && typeof data === 'object') {
        if (Array.isArray((data as any).ids)) {
          ids = (data as any).ids.map(Number);
        }
      }

      setUserBookmarkIds(ids);
    }

    if (email) {
      // eslint-disable-next-line no-void
      void fetchUserBookmarks();
    }
  }, [email]);

  // Is the RIO currently in the modal bookmarked by this user?
  const isSelectedBookmarked = !!selectedRio && userBookmarkIds.includes(selectedRio.id);

  // ---------------------- Toggle bookmark helper ----------------------
  /**
   * Toggle bookmark for a specific RIO.
   * Returns:
   *  - true  => now bookmarked
   *  - false => now unbookmarked
   *  - null  => no-op (not logged in or error)
   */
  const toggleBookmark = async (rioId: number): Promise<boolean | null> => {
    if (!email) return null;

    try {
      const res = await fetch('/api/bookmarks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, rioId }),
      });

      const data = await res.json();

      if (data.bookmarked === true) {
        setUserBookmarkIds((prev) => (prev.includes(rioId) ? prev : [...prev, rioId]));
        setToastMessage('Added to bookmarks!');
        setShowToast(true);
        return true;
      }

      setUserBookmarkIds((prev) => prev.filter((id) => id !== rioId));
      setToastMessage('Removed from bookmarks!');
      setShowToast(true);
      return false;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error toggling bookmark:', err);
      setToastMessage('Error updating bookmark');
      setShowToast(true);
      return null;
    }
  };

  // Card-level icon click (doesn't need to update the count)
  const handleCardBookmarkClick = async (rioId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // ⬅️ prevent card click (modal) from firing
    // eslint-disable-next-line no-void
    void toggleBookmark(rioId);
  };

  // Modal bookmark click: toggle and adjust modal count
  const handleModalBookmarkClick = async () => {
    if (!selectedRio) return;
    const result = await toggleBookmark(selectedRio.id);
    if (result === true) {
      setRioBookmarks((prev) => prev + 1);
    } else if (result === false) {
      setRioBookmarks((prev) => Math.max(prev - 1, 0));
    }
  };

  // ---------------- Open modal & fetch bookmark count ----------------
  const clickRioCard = async (rio: RioType) => {
    setSelectedRio(rio);

    try {
      const res = await fetch(`/api/bookmarks/amount/${rio.id}`);
      const data = await res.json();
      const countRaw = typeof data === 'number' ? data : Number(data.count ?? data.bookmarks ?? 0);

      setRioBookmarks(Number.isFinite(countRaw) ? countRaw : (rio.bookmarks ?? 0));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching bookmark count for modal:', err);
      setRioBookmarks(rio.bookmarks ?? 0);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      <ToastContainer className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
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
            <Card className="trending-card" style={{ position: 'relative', paddingBottom: 30 }}>
              <Row>
                <Col sm={2}>
                  {email && (
                    <button
                      type="button"
                      className="btn p-0 border-0 bg-transparent"
                      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                      onClick={(e) => {
                        // ⬅️ THIS is the important bit so the card bookmark is actually clickable
                        // and doesn’t just open the modal.
                        // eslint-disable-next-line no-void
                        void handleCardBookmarkClick(rio.id, e);
                      }}
                    >
                      {isBookmarked ? <BookmarkCheckFill /> : <Bookmark />}
                    </button>
                  )}
                </Col>
              </Row>

              {/* Clicking the rest of the card opens the modal */}
              <Button style={{ cursor: 'pointer', all: 'unset' }} onClick={() => clickRioCard(rio)}>
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
        size="xl"
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Row>
            <Modal.Title>{selectedRio?.name ?? ''}</Modal.Title>
            <h6 className="py-1">{selectedRio?.interest?.name ?? ''}</h6>
          </Row>
        </Modal.Header>

        <Modal.Body>
          {/* Top row: info + optional image (same layout you wanted) */}
          <Row className="mb-3">
            <Col xs={12} md={selectedRio?.image ? 8 : 12}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                {selectedRio && (
                  <button
                    type="button"
                    className="btn p-0 border-0 bg-transparent"
                    onClick={handleModalBookmarkClick}
                    aria-label={isSelectedBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    <div
                      className="text-dark border border-black rounded px-2 py-2"
                      style={{
                        color: 'inherit',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {isSelectedBookmarked ? (
                        <BookmarkCheckFill size={20} className="me-1" />
                      ) : (
                        <Bookmark size={20} className="me-1" />
                      )}
                      {rioBookmarks}
                    </div>
                  </button>
                )}

                {currentUser && role === 'ADMIN' && selectedRio && (
                  <Button
                    variant="outline-warning"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedRio?.id) {
                        window.location.href = `/editRio/${selectedRio.id}`;
                      }
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>

              <strong>Purpose Statement:</strong>
              <p>{selectedRio?.purposeStatement}</p>

              <div className="mt-3">
                <p>
                  <strong>Main Contact:&nbsp;</strong>
                  {selectedRio?.mainContact}
                </p>
                <p>
                  <strong>Email:&nbsp;</strong>
                  {selectedRio?.email}
                </p>
                <p>
                  <strong>Approved:&nbsp;</strong>
                  {selectedRio?.approvalDate ? new Date(selectedRio.approvalDate).toDateString() : ''}
                </p>
              </div>
            </Col>

            {selectedRio?.image && (
              <Col xs={12} md={4} className="d-flex justify-content-center mt-3 mt-md-0">
                <div className="rb-rio-modal-image-wrapper">
                  <Image src={selectedRio.image} alt={`${selectedRio.name} logo`} className="rb-rio-modal-image" />
                </div>
              </Col>
            )}
          </Row>

          <Row>
            <Col className="d-flex justify-content-start align-items-end">
              {currentUser && role === 'ADMIN' && selectedRio && (
                <Button
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedRio?.id) {
                      window.location.href = `/deleteRio/${selectedRio.id}`;
                    }
                  }}
                >
                  Delete <Trash3 />
                </Button>
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
