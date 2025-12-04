import { Container, Row, Col } from 'react-bootstrap';
import { PageIDs } from '@/utilities/ids';
import RioCardDisplay from '@/components/RioCardDisplay';
import { getTrendingRios, RioType } from '@/lib/dbActions';

export default async function Home() {
  const rios: RioType[] = await getTrendingRios(9);

  return (
    <Container fluid className="g-0 pt-5">
      <div className="home-background-image g-0 pt-5">
        <Row className="d-flex text-light text-center h-100 align-items-center">
          <Col className="justify-content-center">
            <h1 className="fw-bold py-3">
              Find and join RIO&apos;s
              <br />
              at UH Mānoa
            </h1>
            <h2 className="py-3">
              Use the search tab to
              <br />
              search by category or
              <br />
              keywords, or browse below
            </h2>
          </Col>
        </Row>
      </div>
      <Row className="bg-light p-4 g-0">
        <Container className="pt-3 w-75">
          <h2 className="text-primary fw-bold text-start pb-4">
            Trending RIOs
          </h2>
          <div className="trending-panel">
            <Row xs={1} md={3} className="g-4 py-1">
              <RioCardDisplay rioList={rios} />
            </Row>
          </div>
        </Container>
      </Row>
    </Container>
  );

  return (
    <main>
      <div id={PageIDs.landingPage}>
        <div className="Hero-background-image">
          <section className="Hero-section">
            <Container className="text-center">
              <h1 className="text-light fw-bold py-3">
                Find and join RIO&apos;s
                <br />
                at UH Mānoa
              </h1>
              <h2 className="text-light py-3">
                Use the search tab to
                <br />
                search by category or
                <br />
                keywords, or browse below
              </h2>
            </Container>
          </section>

          {/* Trending RIOs Page */}
          <section className="trending-section py-5">
            <Container>
              <h2 className="trending-heading text-start">
                Trending RIOs
              </h2>
              <div className="trending-panel">
                <Row xs={1} md={3} className="g-4 py-1">
                  <RioCardDisplay rioList={rios} />
                </Row>
              </div>
            </Container>
          </section>
        </div>

        {/* EC 12/3/25 Commenting this out. Move to a separate help or guide page. */}
        {/* Rest of the Landing Page */}
        {/* <Container className="pt-3 text-center section-spacing">
          <h2>
            Welcome to RIBows!
          </h2>
          <p>
            Create your profile, add your interest, and then explore and bookmark
            clubs or RIO&apos;s that match what you&apos;re looking for at UH Manoa
          </p>
          <h3>
            Start by making your profile
          </h3>
          <h5>
            Either by clicking sign in at the top right or clicking
            <a href="/auth/signup">here</a>
          </h5>
          <Image src="/images/signup.png" width={500} alt="signup" />
          <h3>
            Then you&apos;re all set up!
            <br />
            Explore, bookmark, and see what&apos;s trending!
          </h3>
          <h3>
            Explore RIO&apos;s with the search tab that match your interests!
          </h3>
          <h3>
            Bookmark them to join later or contact them directly through the app.
          </h3>
        </Container> */}
      </div>
    </main>
  );
}
