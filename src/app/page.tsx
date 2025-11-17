import { Container, Row, Col, Image } from 'react-bootstrap';
import { PageIDs } from '@/utilities/ids';

export default function Home() {
  return (
    <main>
      <div id={PageIDs.landingPage}>
        <div className="landing-white-background">
          <Container className="text-center">
            <h1
              style={{ paddingTop: '20px', color: 'black', fontSize: '36pt' }}
            >
              Welcome to RIBows!
            </h1>
            <h3 style={{ paddingBottom: '20px', color: 'black' }}>
              Where you can find/join clubs or Registered Independent Organizations (RIO&apos;s)
              at UH Manoa
            </h3>
          </Container>
        </div>
        <div className="landing-white-background">
          <Container className="justify-content-center text-center">
            <h2 style={{ color: 'black' }}>
              Start by making your profile
            </h2>
            <h5 style={{ color: 'black' }}>
              Either by clicking sign in at the top right or clicking
              <a href="/auth/signup" style={{ marginLeft: '4px' }}>here</a>
            </h5>
            <Row md={1} lg={2}>
              <Col xs={6}>
                <Image src="/images/home-page.png" width={500} alt="homepage" />
              </Col>
              <Col xs={6}>
                <Image
                  src="/images/profiles-page.png"
                  width={500}
                  alt="profile"
                />
              </Col>
            </Row>
          </Container>
        </div>
        <div className="landing-green-background">
          <Container className="justify-content-center text-center">
            <h3 style={{ paddingTop: '20px', color: 'white' }}>
              Where you will then add your interests to your profile
            </h3>
            <Row md={1} lg={2}>
              <Col xs={6}>
                <Image
                  src="/images/add-project-page.png"
                  width={500}
                  alt="add-project-page"
                />
              </Col>
              <Col xs={6}>
                <Image
                  src="/images/projects-page.png"
                  width={500}
                  alt="projets-page"
                />
              </Col>
            </Row>
          </Container>
        </div>
        <div className="landing-white-background text-center">
          <Container>
            <h2 style={{ paddingTop: '20px', color: '#376551' }}>
              Once you&apos;re all set up
            </h2>
            <h3 style={{ color: '#376551' }}>
              Explore RIO&apos;s with the search tab that match your interests!
              Bookmark them to join later or contact them directly through the app.
              Or look at our most trending tab to see what&apos;s popular!
            </h3>
            <Row md={1} lg={2}>
              <Col xs={6}>
                <Image
                  src="/images/interests-page.png"
                  width={500}
                  alt="interest-page"
                />
              </Col>
              <Col xs={6}>
                <Image
                  src="/images/filter-page.png"
                  width={500}
                  alt="filter-page"
                />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </main>
  );
}
