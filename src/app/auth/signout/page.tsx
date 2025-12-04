'use client';

import { signOut } from 'next-auth/react';
import { Button, Col, Row } from 'react-bootstrap';

/** After the user clicks the "SignOut" link in the NavBar, log them out and display this page. */
const SignOut = () => (
  <div className="pt-5">
    <Col id="signout-page" className="text-center py-3 pt-5">
      <h2>Do you want to sign out?</h2>
      <Row className="justify-content-center mt-3">
        <Col xs="auto">
          <Button
            variant="outline-secondary"
            href="/"
            className="me-2"
          >
            Cancel
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={() => signOut({ callbackUrl: '/', redirect: true })}
          >
            Sign Out
          </Button>
        </Col>
      </Row>
    </Col>
  </div>
);

export default SignOut;
