import { Container, Row, Col } from 'react-bootstrap';
import { Envelope } from 'react-bootstrap-icons';
import MemberCard from '@/components/MemberCard';

const AboutPage = () => {
  const members = [
    {
      name: 'Gerric Abe',
      year: 'Junior',
      email: 'gerrica@hawaii.edu',
      linkedin: 'https://www.linkedin.com/in/alicejohnson',
      image: 'https://github.com/g3rr1c.png',
    },
    {
      name: 'Charles Brown',
      year: 'Junior',
      email: 'cbrown29@hawaii.edu',
      linkedin: 'https://www.linkedin.com/in/charlesbrown',
      image: 'https://avatars.githubusercontent.com/u/17363228?v=4',
    },
    {
      name: 'Ethan Chiu',
      year: 'Junior',
      email: 'chiue@hawaii.edu',
      linkedin: 'https://www.linkedin.com/in/bobsmith',
      image: 'https://github.com/ethnchiu.png',
    },
    {
      name: 'Kate Hamada',
      year: 'Junior',
      email: 'kateh2@hawaii.edu',
      linkedin: 'https://www.linkedin.com/in/bobsmith',
      image: 'https://avatars.githubusercontent.com/u/165729175?v=4',
    },
    {
      name: 'Tyler Jordan Acasio',
      year: 'Junior',
      email: 'tjacasio@hawaii.edu',
      linkedin: 'https://www.linkedin.com/in/bobsmith',
      image: 'https://github.com/tjlacasio.png',
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
              At RIBows, our mission is to connect students with Registered Independent Organizations (RIOs) that align
              with their interests and passions. We strive to create a vibrant community where students can discover,
              engage with, and contribute to various RIOs on campus.
            </p>
          </Col>
        </Row>
        <Row className="py-3">
          <Col className="text-center">
            <h2>Our Team</h2>
          </Col>
        </Row>
        <Row xs={1} md={2} lg={3} className="d-flex justify-content-center rounded g-4 my-2 py-3">
          {members.map((member) => (
            <Col key={`Contact-${member.name}`}>
              <MemberCard {...member} />
            </Col>
          ))}
        </Row>
        <Row className="py-5">
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
