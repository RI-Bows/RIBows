import DeleteRioForm from '@/components/DeleteRioForm';
import { getRioById } from '@/lib/dbActions';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function EditRioPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  if (!session.user || ((session.user as any).role !== 'ADMIN')) {
    return (
      <Container>
        <Row className="py-3">
          <Col className="text-center">
            <h1>Error</h1>
            <p>Unauthorized: Only RIOs or admins can delete RIOs.</p>
            <Button variant="primary" href="/">Go to Home</Button>
          </Col>
        </Row>
      </Container>
    );
  }

  const rioId = Number(params.id);
  const rio = await getRioById(rioId);

  if (!rio) {
    return (
      <Container>
        <Row className="py-3">
          <Col className="text-center">
            <h1>Error Message</h1>
            <p>
              The RIO was not found.
              {'\n'}
              RIO ID:
              {rioId}
              {'\n'}
              RIO:
              {rio}
              {'\n'}
              Check the database
            </p>
            <Button variant="primary" href="/">Go to Home</Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="pt-5 p-4 bg-white">
      <Row className="py-3 g-0 pt-5">
        <Col className="text-center">
          <h1>Are you sure you want to delete this RIO?</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <DeleteRioForm rio={rio} />
        </Col>
      </Row>
    </Container>
  );
}
