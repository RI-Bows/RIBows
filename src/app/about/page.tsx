import { Container, Row, Col } from 'react-bootstrap';
import { Envelope } from 'react-bootstrap-icons';
import MemberCard from '@/components/MemberCard';

const AboutPage = () => {
  const members = [
    {
      name: 'Alice Johnson',
      year: 'Senior',
      email: '',
      linkedin: 'https://www.linkedin.com/in/alicejohnson',
      image: '/images/members/alice.jpg',
    },
    {
      name: 'Bob Smith',
      year: 'Junior',
      email: '',
      linkedin: 'https://www.linkedin.com/in/bobsmith',
      image: '/images/members/bob.jpg',
    },
  ];

  return (
    <main>
      <Container>
        <Row className="py-3">
          <Col className="text-center">
            <h1>About Us</h1>
          </Col>
        </Row>
        <Row className="py-3">
          <Col className="text-center">
            <h2>Our Mission</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
          </Col>
        </Row>
        <Row className="py-3">
          <Col className="text-center">
            <h2>Our Team</h2>
          </Col>
        </Row>
        <Row xs={1} md={2} lg={3} className="rounded g-4 my-2 py-3">
          {members.map((member) => (
            <Col key={`Contact-${member.name}`}>
              <MemberCard {...member} />
            </Col>
          ))}
        </Row>
        <Row className="py-3">
          <Col className="text-center">
            <h2>Contact Us!</h2>
            <p>We&apos;d love to hear from you. Please reach out with any questions or comments.</p>
            <Row className="g-4 justify-content-center">
              <Col>
                <a href="mailto:contact@ribows.com" className="text-black">
                  <Envelope size={32} />
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AboutPage;
