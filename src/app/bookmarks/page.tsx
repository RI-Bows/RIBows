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
      <Container fluid className="pt-5">
        <Row className="bg-light p-4">
          <Container className="pt-4 w-75">
            <h2 className="text-primary fw-bold text-center pb-4">
              Bookmarked RIOs
            </h2>
            <div className="trending-panel">
              <Row xs={1} md={3} className="g-4 py-1 justify-content-center">
                {rios.length === 0 ? (
                  <Col className="text-center">
                    <p>
                      You have no bookmarked RIOs. To bookmark an RIO, navigate to the{' '}
                      <a href="/search">Search Page</a> and click the bookmark icon on
                      an RIO to save it.
                    </p>
                  </Col>
                ) : (
                  <RioCardDisplay rioList={rios} />
                )}
              </Row>
            </div>
          </Container>
        </Row>
      </Container>
    </main>
  );
};

export default BookmarksPage;
