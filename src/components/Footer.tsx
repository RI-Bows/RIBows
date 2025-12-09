import { Col, Container, Row } from 'react-bootstrap';
import Image from 'next/image';

/* The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="text-light text-center mt-auto py-4 bg-primary">
    <Container>
      {/* RIBows info block */}
      <Row className="justify-content-center">
        <Col xs="auto">
          <div className="d-flex justify-content-center fw-bold pb-1">
            <h5>RIBows</h5>
            <Image src="/images/logo.png" width={20} height={20} alt="Rainbow" className="mb-1" />
          </div>
          <div className="pb-1">
            University of Hawaii
            <br />
            Honolulu, HI 96822
            <br />
          </div>
          <div className="pb-1">
            <a href="https://ri-bows.github.io" target="_blank" rel="noreferrer" className="text-light">
              <strong>
                https://ri-bows.github.io
              </strong>
            </a>
          </div>
          <div className="pb-1">
            We would love to hear your{' '}
            <a href="/feedback" className="text-white">
              <strong>
                feedback!
              </strong>
            </a>
          </div>
          {/* Help / FAQ link */}
          <div className="">
            Need help? Visit our{' '}
            <a href="/help" className="text-white">
              <strong>Help page</strong>
            </a>
            .
          </div>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
