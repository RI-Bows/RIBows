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
    return <div>Error: user not logged in</div>;
  }

  const rios: RioType[] = await getBookmarkedRios(email) ?? [];

  return (
    <main>
      <Container className="py-5">
        <Row className="">
          <Col className="text-center">
            <h1>Bookmarks</h1>
          </Col>
        </Row>
        <Row>
          <Col className="text-center pt-2">
            <h5>All of your saved RIOs.</h5>
          </Col>
        </Row>
        <Row xs={1} md={2} lg={3} className="trending-panel my-2 py-3">
          <RioCardDisplay rioList={rios} />
        </Row>
      </Container>
    </main>
  );
};

export default BookmarksPage;
