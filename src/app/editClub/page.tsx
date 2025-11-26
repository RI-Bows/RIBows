import EditClubForm from '@/components/EditClubForm';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Container, Row, Col } from 'react-bootstrap';

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
    return <div>Unauthorized: Only clubs can edit RIOs.</div>;
  }

  // Find the RIO by the logged-in user's email
  const rio = await prisma.rio.findFirst({
    where: { email: session.user.email },
    include: { interest: true },
  });

  if (!rio) {
    return <div>RIO not found for your account.</div>;
  }

  return (
    <Container>
      <Row className="py-3">
        <Col className="text-center">
          <h1>Edit RIO</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <EditClubForm rio={rio} />
        </Col>
      </Row>
    </Container>
  );
}
