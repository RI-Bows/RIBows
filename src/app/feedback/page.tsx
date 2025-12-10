'use client';

import { Container, Row, Col, Ratio } from 'react-bootstrap';

const Feedback = () => (
  <main>
    <Container fluid className="pt-5 bg-light">
      <Row className="pt-5">
        <Col className="text-center">
          <h2 className="text-primary fw-bold">Feedback Form</h2>
          Thank you for taking the time to give us feedback!
          <br />
          Please provide any suggestions below.
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Ratio aspectRatio="16x9" className="w-75">
          <iframe
            title="Feedback Form"
            // eslint-disable-next-line max-len
            src="https://docs.google.com/forms/d/e/1FAIpQLSdboJ3GTp9fTSk3WfOXxrFUNfDRjfx6v0pQ_Eca-v-BJsjx3A/viewform?usp=dialog"
            className="rounded p-4"
          >
            Loading…
          </iframe>
        </Ratio>
      </Row>
    </Container>
  </main>
);

export default Feedback;
