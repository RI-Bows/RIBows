import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import MemberCard from '@/components/MemberCard';

const AboutPage = () => {
  const members = [
    {
      name: 'Gerric Abe',
      year: 'Junior',
      email: 'gerrica@hawaii.edu',
      linkedin: 'https://www.linkedin.com/in/gerric-abe/',
      github: 'https://github.com/g3rr1c/',
      portfolio: 'https://g3rr1c.github.io/',
      image: 'https://github.com/g3rr1c.png',
    },
    {
      name: 'Charles Brown',
      year: 'Junior',
      email: 'cbrown29@hawaii.edu',
      linkedin: 'https://www.linkedin.com/in/charlesbrown-iii',
      github: 'https://github.com/cbxiii/',
      portfolio: 'https://cbxiii.github.io/',
      image: 'https://avatars.githubusercontent.com/u/17363228?v=4',
    },
    {
      name: 'Ethan Chiu',
      year: 'Junior',
      email: 'chiue@hawaii.edu',
      linkedin: 'https://www.linkedin.com/in/ethnchiu/',
      github: 'https://github.com/ethnchiu/',
      portfolio: 'https://ethnchiu.github.io/',
      image: 'https://github.com/ethnchiu.png',
    },
    {
      name: 'Kate Hamada',
      year: 'Junior',
      email: 'kateh2@hawaii.edu',
      linkedin: 'https://www.linkedin.com/in/kate-hamada-/',
      github: 'https://github.com/katehamada/',
      portfolio: 'https://katehamada.github.io/',
      image: 'https://avatars.githubusercontent.com/u/165729175?v=4',
    },
    {
      name: 'Tyler Jordan Acasio',
      year: 'Junior',
      email: 'tjacasio@hawaii.edu',
      linkedin: 'https://www.linkedin.com/in/tjlacasio/',
      github: 'https://github.com/tjlacasio/',
      portfolio: 'https://tjlacasio.github.io/',
      image: 'https://github.com/tjlacasio.png',
    },
  ];

  return (
    <main>
      <Container fluid className="pt-5 bg-light">
        <Row className="pt-5">
          <Col className="text-center">
            <h2 className="text-primary fw-bold">About Us</h2>
          </Col>
        </Row>
        <Row className="pt-3">
          <Col className="text-center">
            <p className="mx-auto w-50">
              <big>
                At RIBows, our mission is to connect students with Registered Independent Organizations (RIOs) that
                align with their interests and passions. We strive to create a vibrant community where students can
                discover, engage with, and contribute to various RIOs on campus. Through our platform, we aim to foster
                collaboration, personal growth, and a sense of belonging among students and RIOs alike.
              </big>
            </p>
          </Col>
        </Row>
        <Row xs={1} md={2} lg={3} className="d-flex justify-content-center rounded g-4 p-3">
          {members.map((member) => (
            <Col key={`Contact-${member.name}`}>
              <MemberCard {...member} />
            </Col>
          ))}
        </Row>
        <Row className="py-4">
          <Col className="text-center">
            <h2 className="text-primary fw-bold">Contact Us!</h2>
            <p className="pt-2">
              <big>
                We&apos;d love to hear from you. Please reach out below with any questions or comments.
              </big>
            </p>
            <Row className="pt-1 g-4 justify-content-center">
              <Col>
                <Link href="/feedback">
                  {/* <Envelope size={32} /> */}
                  <Button variant="outline-success">Feedback Page</Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AboutPage;
