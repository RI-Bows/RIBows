import EditClubForm from '@/components/EditRioForm';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default async function EditClubPage() {
  // Get the current user session (pass authOptions)
  const session = await getServerSession(authOptions);

  console.log(session);
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  console.log('Test email:', session?.user?.email);
  console.log('Test role:', (session?.user as any)?.role);
  // Check authorization first
  // Cast session.user to `any` to access custom `role` property added to the user object by NextAuth callbacks
  if (!session.user || (((session.user as any).role !== 'CLUB') && ((session.user as any).role !== 'ADMIN'))) {
    return (
      <Container>
        <Row className="py-3">
          <Col className="text-center">
            <h1>Error</h1>
            <p>Unauthorized: Only clubs can edit RIOs.</p>
            <Button variant="primary" href="/">Go to Home</Button>
          </Col>
        </Row>
      </Container>
    );
  }

  // Find the RIO by the logged-in user's email
  const rio = await prisma.rio.findFirst({
    where: { email: session.user.email },
    include: { interest: true },
  });

  if (!rio) {
    return (
      <Container>
        <Row className="py-3">
          <Col className="text-center">
            <h1>Error</h1>
            <p>
              Your RIO or Club was not found. Please contact support at
              {' '}
              <u>support@example.com</u>
              {' '}
              if you believe this is an error.
            </p>
            <Button variant="primary" href="/">Go to Home</Button>
          </Col>
        </Row>
      </Container>
    );
  }

  const allInterests = await prisma.interest.findMany({ orderBy: { name: 'asc' } });
  const interestNames = allInterests.map((i) => i.name);

  return (
    <Container fluid className="p-4 bg-white">
      <Row className="py-3">
        <Col className="text-center">
          <h1>Edit RIO</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <EditClubForm rio={rio} interestOptions={interestNames} />
        </Col>
      </Row>
    </Container>
  );
}
