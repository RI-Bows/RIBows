import { Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';

/* The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="rb-footer mt-auto">
    <Container>
      {/* Powered by + logo */}
      <Row className="justify-content-center">
        <Col xs="auto">
          <div className="rb-footer-powered">Made for</div>
          <div className="rb-footer-logo-circle">
            <span className="rb-footer-logo-text">UH</span>
          </div>
        </Col>
      </Row>

      {/* RIBows info block */}
      <Row className="justify-content-center mt-4">
        <Col xs="auto">
          <div className="rb-footer-title">
            RIBows
            <Image src="/images/logo.png" width={20} height={20} style={{ marginBottom: 3 }} alt="Rainbow" />
          </div>
          <div className="rb-footer-address">
            University of Hawaii
            <br />
            Honolulu, HI 96822
            <br />
          </div>

          <a
            href="https://ri-bows.github.io"
            target="_blank"
            rel="noreferrer"
            className="rb-footer-link"
          >
            https://ri-bows.github.io
          </a>

          {/* eslint-disable-next-line no-trailing-spaces, react/jsx-one-expression-per-line */}
          <div className="rb-footer-feedback">
            We would love to hear your&nbsp;
            <a href="/feedback" className="rb-footer-link">
              feedback!
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
