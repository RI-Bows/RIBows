/* eslint-disable max-len */
import { Container, Row, Col } from 'react-bootstrap';
import { getServerSession } from 'next-auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { authOptions } from '@/lib/auth';
import { getBookmarkedRios, RioType } from '@/lib/dbActions';
import RioCardDisplay from '@/components/RioCardDisplay';

const BookmarksPage = async () => {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const email = session?.user?.email;

  if (!email) {
    return (
      <main>
        <Container className="py-5">
          <Row>
            <Col md="auto" className="text-center">
              <p>Error: user not logged in</p>
            </Col>
          </Row>
        </Container>
      </main>
    );
  }

  const rios: RioType[] = (await getBookmarkedRios(email)) ?? [];

  return (
    <main>
      <Container className="py-5">
        <Row>
          <Col className="text-center pb-4">
            <h1>Bookmarks</h1>
            <h5 className="pt-2">All of your saved RIOs.</h5>
          </Col>
        </Row>

        {rios.length === 0 ? (
          // Empty state: panel with centered message
          <Row className="trending-panel my-2 py-2 justify-content-center">
            <Col md={8} className="text-center text-muted py-2">
              <p style={{ fontSize: '1.0rem' }}>
                You have no bookmarked RIOs. To bookmark a RIO, navigate to the{' '}
                <a href="/search">Search page</a> and click the bookmark icon on
                a RIO to save it here.
              </p>
            </Col>
          </Row>
        ) : (
          // Non-empty state: panel with grid of cards
          <div className="trending-panel">
            <Row xs={1} md={3} className="g-4">
              <RioCardDisplay rioList={rios} />
            </Row>
          </div>
        )}
      </Container>
    </main>
  );
};

export default BookmarksPage;
