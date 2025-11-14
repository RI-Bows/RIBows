/* eslint-disable max-len */
import { Container, Row, Col } from 'react-bootstrap';
import { getServerSession } from 'next-auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { authOptions } from '@/lib/auth';
import RIOCard from '@/components/RIOCard';

const BookmarksPage = async () => {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const rios = [
    {
      firstName: 'Philip',
      lastName: 'Johnson',
      address: 'POST 307, University of Hawaii',
      image: 'https://github.com/philipmjohnson.png',
      description:
        'I am a Professor of Information and Computer Sciences at the University of Hawaii, Director of the Collaborative Software Development Laboratory, and the CEO of OpenPowerQuality.com.',
      owner: 'john@foo.com',
    },
    {
      firstName: 'Henri',
      lastName: 'Casanova',
      address: 'POST 307, University of Hawaii',
      image: 'https://avatars0.githubusercontent.com/u/7494478?s=460&v=4',
      description:
        'I am originally from France. I maintain a list of reports from my surf sessions. I have proof that I ran the Hana relay with an actual Team.',
      owner: 'john@foo.com',
    },
    {
      firstName: 'Kim',
      lastName: 'Binsted',
      address: 'POST 307, University of Hawaii',
      image: 'https://www.ics.hawaii.edu/wp-content/uploads/2013/08/kim_binsted-square-300x300.jpg',
      description:
        'Kim Binsted received her BSc in Physics at McGill (1991), and her PhD in Artificial Intelligence from the University of Edinburgh (1996). Her thesis topic was the computational modeling and generation of punning riddles, and her program, JAPE (Joke Analysis and Production Engine), generated puns such as "What do you call a Martian who drinks beer? An ale-ien!".',
      owner: 'admin@foo.com',
    },
  ];

  return (
    <main>
      <Container>
        <Row className="py-3">
          <Col className="text-center">
            <h1>Bookmarks Page</h1>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <h5>All of your bookmarked RIOs.</h5>
          </Col>
        </Row>
        <Row xs={1} md={2} lg={3} className="g-4">
          {rios.map((rio) => (
            <Col key={`Contact-${rio.firstName}`}>
              <RIOCard {...rio} />
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
};

export default BookmarksPage;
