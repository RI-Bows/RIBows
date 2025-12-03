'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Modal, Row } from 'react-bootstrap';
import { Bookmark, BookmarkCheckFill } from 'react-bootstrap-icons';
import { RioType } from '@/lib/dbActions';
import { useSession } from 'next-auth/react';

type Props = {
  rioList: RioType[];
};

const RIOCardDisplay: React.FC<Props> = ({ rioList }: Props) => {
  const { data: session } = useSession();
  // role for admin or club person to edit their club
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const role = (session?.user as any)?.role ?? null;
  const email = session?.user?.email;

  const [userBookmarks, setUserBookmarks] = useState<number[]>([]);
  const [selectedRio, setSelectedRio] = useState<RioType | null>(null);

  useEffect(() => {
    if (!email) return;

    const fetchBookmarks = async () => {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      const data: RioType[] = await res.json();
      setUserBookmarks(data.map(rio => rio.id));
    };

    fetchBookmarks();
  }, [email]);

  const toggleBookmark = (rioId: number) => {
    setUserBookmarks(prev => (prev.includes(rioId)
      ? prev.filter(id => id !== rioId)
      : [...prev, rioId]));
  };

  return (
    <>
      {rioList.map((rio) => {
        const isBookmarked = userBookmarks.includes(rio.id);

        return (
          <Col key={rio.id} md={4}>

            <Card className="trending-card">
              <Row>
                <Col sm={2}>
                  {email && (
                  <Button
                    style={{ cursor: 'pointer', all: 'unset' }}
                    onClick={() => toggleBookmark(rio.id)}
                    className="mb-3"
                  >
                    {isBookmarked ? <BookmarkCheckFill /> : <Bookmark />}
                  </Button>
                  )}
                </Col>
              </Row>
              <Button
                style={{ cursor: 'pointer', all: 'unset' }}
                onClick={() => setSelectedRio(rio)}
                className="trending-card-button"
              >
                <h5 className="trending-card-title">{rio.name}</h5>
                <p className="text-muted mb-1 text-center">{rio.interest.name}</p>
                <CardBody>
                  <p className="trending-card-text">{rio.purposeStatement}</p>
                </CardBody>
              </Button>
            </Card>
          </Col>
        );
      })}

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
