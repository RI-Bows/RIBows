/* eslint-disable arrow-body-style */
import { Container, Row, Col } from 'react-bootstrap';
import EditProfileForm from '@/components/EditProfileForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getInterests } from '@/lib/dbActions';
import { loggedInProtectedPage } from '../lib/page-protection';

const EditProfilePage = async () => {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const email = session?.user?.email ?? null;

  // fetch the current user including their interests for default values
  const user = email
    ? await prisma.user.findUnique({
      where: { email },
      include: { interests: true },
    })
    : null;

  // fetch all interest names for the multiselect options
  const allInterests = await getInterests();
  const interestOptions = Array.isArray(allInterests) ? allInterests.map((i) => i.name) : [];

  // Normalize shape so the client component's normalization logic picks up values
  const userForClient = user
    ? {
      ...user,
      Interests: (user as any).interests ?? [],
      interest: (user as any).interests?.[0] ?? null,
    }
    : undefined;

  return (
    <main>
      <Container fluid className="pt-5 p-4 bg-white">
        <Row className="py-3 pt-5">
          <Col className="text-center">
            <h1>Edit Profile</h1>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <EditProfileForm user={userForClient} interestOptions={interestOptions} />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default EditProfilePage;
