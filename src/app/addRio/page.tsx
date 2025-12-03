/*
import React from 'react';
import { Container } from 'react-bootstrap';
import AddRioForm from '@/components/AddRioForm';

const AddRIOPage = () => (
  <Container className="py-3">
    <AddRioForm />
  </Container>
);

export default AddRIOPage;
*/

import AddRioForm from '@/components/AddRioForm';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function AddRioPage() {
  const session = await getServerSession(authOptions);
  const allInterests = await prisma.interest.findMany({ orderBy: { name: 'asc' } });
  const interestNames = allInterests.map((i) => i.name);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  if (!session.user || ((session.user as any).role !== 'ADMIN')) {
    return (
      <Container>
        <Row className="py-3">
          <Col className="text-center">
            <h1>Error</h1>
            <p>Unauthorized: Only admin can add an RIO.</p>
            <Button variant="primary" href="/">Go to Home</Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="py-3">
        <Col className="text-center">
          <h1>Add RIO</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <AddRioForm interestOptions={interestNames} />
        </Col>
      </Row>
    </Container>
  );
}
