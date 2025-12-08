'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal, Row, Toast, ToastContainer, Container, Col } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { Bookmark, BookmarkCheckFill, Envelope, Trash3 } from 'react-bootstrap-icons';
import type { RioType } from '@/lib/dbActions';

type Props = {
  rioList: RioType[];
};

// eslint-disable-next-line react/prop-types
const LandingSearchBar: React.FC<Props> = ({ rioList }) => {
  const [term, setTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedRio, setSelectedRio] = useState<RioType | null>(null);

  const { data: session } = useSession();
  const email = session?.user?.email ?? null;
  const role = (session?.user as any)?.role ?? null;
  const currentUser = session?.user?.email ?? null;

  // IDs of RIOs this user has bookmarked
  const [userBookmarkIds, setUserBookmarkIds] = useState<number[]>([]);

  // bookmark count for the selected RIO in the modal
  const [modalBookmarks, setModalBookmarks] = useState<number>(0);

  // toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const router = useRouter();

  // -------------------- Fetch current user's bookmark IDs --------------------
  useEffect(() => {
    async function fetchBookmarks() {
      if (!email) {
        setUserBookmarkIds([]);
        return;
      }

      try {
        const res = await fetch('/api/bookmarks/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        let ids: number[] = [];
        if (Array.isArray(data)) {
          if (data.length === 0) ids = [];
          else if (typeof data[0] === 'number') {
            ids = data as number[];
          } else {
            ids = data.map((d: any) => Number(d.rioId ?? d.id ?? d.rio?.id ?? d)).filter(Boolean);
          }
        } else if (data && typeof data === 'object' && Array.isArray((data as any).ids)) {
          ids = (data as any).ids.map(Number);
        }

        setUserBookmarkIds(ids);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching bookmarks in landing search:', err);
      }
    }

    fetchBookmarks();
  }, [email]);

  // Is the RIO currently shown in the modal bookmarked by this user?
  const isSelectedBookmarked = !!selectedRio && userBookmarkIds.includes(selectedRio.id);

  // ------------------------- Toggle bookmark helper -------------------------
  /**
   * Toggle bookmark for a specific RIO.
   * Returns:
   *  - true  => now bookmarked
   *  - false => now un-bookmarked
   *  - null  => no-op (e.g. not logged in)
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
      console.error('Error toggling bookmark in landing search:', err);
      setToastMessage('Error updating bookmark');
      setShowToast(true);
      return null;
    }
  };

  // Suggestions list uses toggleBookmark but doesn't care about count
  const handleSuggestionBookmarkClick = (rioId: number) => {
    // eslint-disable-next-line no-void
    void toggleBookmark(rioId);
  };

  // Modal bookmark click: toggle and update the count in the pill
  const handleModalBookmarkClick = async () => {
    if (!selectedRio) return;
    const result = await toggleBookmark(selectedRio.id);
    if (result === true) {
      setModalBookmarks((prev) => prev + 1);
    } else if (result === false) {
      setModalBookmarks((prev) => Math.max(prev - 1, 0));
    }
  };

  // ---- suggestions ----
  const suggestions = useMemo(() => {
    const q = term.trim().toLowerCase();

    let base = rioList;
    if (q) {
      // eslint-disable-next-line react/prop-types
      base = rioList.filter(
        (rio) => rio.name.toLowerCase().includes(q)
          || rio.interest.name.toLowerCase().includes(q)
          || rio.purposeStatement?.toLowerCase().includes(q),
      );
    }

    return base.slice(0, 50);
  }, [term, rioList]);

  // --------------------- Open modal & fetch bookmark count -------------------
  const openRioModal = async (rio: RioType) => {
    setSelectedRio(rio);

    try {
      const res = await fetch(`/api/bookmarks/amount/${rio.id}`);
      const data = await res.json();

      const countRaw = typeof data === 'number' ? data : Number(data.count ?? data.bookmarks ?? 0);

      setModalBookmarks(Number.isFinite(countRaw) ? countRaw : (rio.bookmarks ?? 0));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching bookmark count for modal:', err);
      setModalBookmarks(selectedRio?.bookmarks ?? 0);
    }
  };

  // --------------------------- Search form handlers --------------------------
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = term.trim();

    if (!trimmed) {
      router.push('/search');
    } else {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
    }
    setIsFocused(false);
  };

  const handleSuggestionClick = (rio: RioType) => {
    setTerm(rio.name);
    setIsFocused(false);
    // eslint-disable-next-line no-void
    void openRioModal(rio);
  };

  return (
    <Container style={{ position: 'absolute' }}>
      {/* Toast (top-right, same as Search page) */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={2000}
          autohide
          bg={toastMessage.includes('Error') ? 'danger' : 'success'}
        >
          <Toast.Header>
            <strong className="me-auto">Bookmark</strong>
          </Toast.Header>
          <Toast.Body className={toastMessage.includes('Error') ? 'text-white' : ''}>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Search + suggestions */}
      <div
        className="w-100 d-flex flex-column align-items-center"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setIsFocused(false);
          }
        }}
      >
        {/* Search input */}
        <form onSubmit={handleSubmit} className="w-100 d-flex justify-content-center">
          <input
            type="text"
            value={term}
            placeholder="Search for RIOs by name, interest, or keyword"
            onChange={(e) => {
              setTerm(e.target.value);
              setSelectedRio(null);
            }}
            onFocus={() => setIsFocused(true)}
            className="search-input w-100 py-3 border border-gray-300 rounded-5"
            style={{ maxWidth: '900px' }}
          />
        </form>

        {/* Autocomplete dropdown */}
        <div className="w-100 d-flex justify-content-center" style={{ maxWidth: '900px' }}>
          {isFocused && suggestions.length > 0 && (
            <div className="w-100 mt-2">
              <ul
                className="list-group shadow-sm rb-landing-search-suggestions"
                style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  borderRadius: '18px',
                  zIndex: 9999,
                }}
              >
                {suggestions.map((rio) => {
                  const isBookmarked = userBookmarkIds.includes(rio.id);

                  return (
                    <li key={rio.id} className="list-group-item p-0">
                      <button
                        type="button"
                        className="w-100 text-start border-0 bg-transparent px-3 py-2"
                        onMouseDown={(e) => {
                          e.preventDefault(); // keep focus on input
                          handleSuggestionClick(rio);
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <div>{rio.name}</div>
                            <div>{rio.interest.name}</div>
                          </div>

                          {email && (
                            <button
                              type="button"
                              className="btn btn-link p-0 ms-3"
                              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation(); // don’t trigger the outer button
                                handleSuggestionBookmarkClick(rio.id);
                              }}
                            >
                              {isBookmarked ? (
                                <BookmarkCheckFill className="rb-bookmark-icon rb-bookmark-icon-active" />
                              ) : (
                                <Bookmark className="rb-bookmark-icon" />
                              )}
                            </button>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Updated pop-up RIO card (matches RioCardDisplay modal) */}
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
          <div className="d-flex align-items-center justify-content-between mb-2">
            {/* CLICKABLE bookmark + count */}
            {selectedRio && (
              <button
                type="button"
                className="btn p-0 border-0 bg-transparent"
                onClick={handleModalBookmarkClick}
                aria-label={isSelectedBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <div
                  className="text-dark border border-black rounded px-2 py-2"
                  style={{ color: 'inherit', backgroundColor: '#ffffff' }}
                >
                  {isSelectedBookmarked ? (
                    <BookmarkCheckFill size={20} className="me-1" />
                  ) : (
                    <Bookmark size={20} className="me-1" />
                  )}
                  {modalBookmarks}
                </div>
              </button>
            )}

            {/* Optional: Edit for admins */}
            {currentUser && role === 'ADMIN' && selectedRio && (
              <Button
                variant="outline-warning"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/editRio/${selectedRio.id}`;
                }}
              >
                Edit
              </Button>
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
            {/* Optional: Delete for admins */}
            <Col className="d-flex justify-content-start align-items-end">
              {currentUser && role === 'ADMIN' && selectedRio && (
                <Button
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/deleteRio/${selectedRio.id}`;
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
    </Container>
  );
};

export default LandingSearchBar;
