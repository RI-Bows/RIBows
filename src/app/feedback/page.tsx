'use client';

/* eslint-disable arrow-body-style */
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Feedback = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get('email');
    const feedback = formData.get('feedback');

    console.log('Submitted:', { email, feedback });
    // eslint-disable-next-line no-alert
    alert('Form submitted! Mahalo!');
  };

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
          <Col md={8} lg={6}>
            <Form method="post" onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <input name="email" type="text" className="form-control" />
              </Form.Group>

              <Form.Group className="pt-2">
                <Form.Label>Feedback</Form.Label>
                <textarea
                  name="password"
                  className="form-control"
                  rows={5}
                />
              </Form.Group>

              <Button type="submit" className="mt-3">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Feedback;
