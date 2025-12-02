import EditClubForm from '@/components/EditClubForm';
import { getRioById } from '@/lib/dbActions';
import { Container, Row, Col } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';

export default async function EditRioPage({ params }: { params: { id: string } }) {
  const rioId = Number(params.id);
  const rio = await getRioById(rioId);

  if (!rio) {
    return <div>RIO not found</div>;
  }

  const allInterests = await prisma.interest.findMany({ orderBy: { name: 'asc' } });
  const interestNames = allInterests.map((i) => i.name);

  return (
    <Container>
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
