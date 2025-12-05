'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

/** The sign in page. */
const SignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const email = target.email.value;
    const password = target.password.value;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/',
    });

    setLoading(false);

    if (result?.error) {
      setError('Your email or password is incorrect.');
      return;
    }

    if (result?.ok && result.url) {
      window.location.href = result.url;
    }
  };

  return (
    <main>
      <Container fluid className="pt-5 p-4 bg-white">
        <Row className="pt-5 justify-content-center">
          <Col xs={12} md={5}>
            <h1 className="text-center mb-4">Sign In</h1>
            <Card>
              <Card.Body>
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Form method="post" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" autoComplete="email" required />
                  </Form.Group>

                  <Form.Group className="pt-2" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" autoComplete="current-password" required />
                  </Form.Group>

                  <Button type="submit" className="mt-3" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign In'}
                  </Button>
                </Form>
              </Card.Body>

              <Card.Footer>
                Don&apos;t have an account? &nbsp;
                <a href="/auth/signup">Sign up</a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignIn;
