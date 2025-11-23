import { Container, Row, Col } from 'react-bootstrap';
import { Envelope } from 'react-bootstrap-icons';

const AboutPage = () => (
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
      <Row className="py-3">
        <Col className="text-center">
          <h2>Contact Us!</h2>
          <p>We&apos;d love to hear from you. Please reach out with any questions or comments.</p>
          <Row className="g-4 justify-content-center">
            <Col>
              <Envelope size={32} />
            </Col>
            <Col>
              <p>
                <a href="mailto:contact@ribows.com">contact@ribows.com</a>
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  </main>
);

export default AboutPage;
