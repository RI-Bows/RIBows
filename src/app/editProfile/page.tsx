/* eslint-disable arrow-body-style */
import { Container, Row, Col } from 'react-bootstrap';
import EditProfileForm from '@/components/EditProfileForm';

const EditProfilePage = async () => {
  return (
    <main>
      <Container>
        <Row className="py-3">
          <Col className="text-center">
            <h1>Edit Profile</h1>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <EditProfileForm />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default EditProfilePage;
