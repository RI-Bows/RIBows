'use client';

/* eslint-disable arrow-body-style */
import { Container, Row, Col, Ratio } from 'react-bootstrap';

const Feedback = () => {
  return (
    <main>
      <Container>
        <Row className="py-3">
          <Col className="text-center">
            <h1>Feedback Form</h1>
            Thank you for taking the time to give us feedback!
            <br />
            Please give us any suggestions to improve our page! Mahalo!
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col>
            <Ratio aspectRatio="16x9">
              <iframe
                title="Feedback Form"
                // eslint-disable-next-line max-len
                src="https://docs.google.com/forms/d/e/1FAIpQLSdboJ3GTp9fTSk3WfOXxrFUNfDRjfx6v0pQ_Eca-v-BJsjx3A/viewform?usp=dialog"
                className="rounded p-4"
              >
                Loading…
              </iframe>
            </Ratio>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Feedback;
