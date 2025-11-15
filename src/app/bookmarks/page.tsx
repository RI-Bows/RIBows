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
      name: '8bit',
      type: 'Academic/Professional',
      main_contact: 'Jalen Lum',
      email: 'jlum@foo.com',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      name: 'Aikido Club at UHM',
      type: 'Leisure/Recreational',
      main_contact: 'Henri Bouchard',
      email: 'henri@foo.com',
      description:
        'To practice aikido.',
    },
    {
      name: 'Hui Dui',
      type: 'Academic/Professional',
      main_contact: 'Kimothy Chang',
      email: 'kim@foo.com',
      description:
        'Kim Binsted received her BSc in Physics at McGill (1991), and her PhD in Artificial Intelligence from the University of Edinburgh (1996). Her thesis topic was the computational modeling and generation of punning riddles, and her program, JAPE (Joke Analysis and Production Engine), generated puns such as "What do you call a Martian who drinks beer? An ale-ien!".',
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
          <Col className="text-center pb-4">
            <h5>All of your bookmarked RIOs.</h5>
          </Col>
        </Row>
        <Row xs={1} md={2} lg={3} className="bg-success rounded g-4 my-2 py-3">
          {rios.map((rio) => (
            <Col key={`Contact-${rio.name}`}>
              <RIOCard {...rio} />
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
};

export default BookmarksPage;
