import { Container, Row, Col } from 'react-bootstrap';
import { ChevronDown } from 'react-bootstrap-icons';
import { PageIDs } from '@/utilities/ids';
import RioCardDisplay from '@/components/RioCardDisplay';
import LandingSearchBar from '@/components/LandingSearchBar';
import { getTrendingRios, getRios, RioType } from '@/lib/dbActions';

export default async function Home() {
  const allRios: RioType[] = await getRios();
  const trendingRios: RioType[] = await getTrendingRios(9);

  return (
    <main>
      <Container fluid className="g-0 pt-5 bg-primary">
        {/* HERO WITH BACKGROUND IMAGE */}
        <div id={PageIDs.landingPage} className="home-background-image">
          <div className="home-hero-content">
            <Row className="d-flex text-light text-center align-items-center pb-4">
              <Col className="justify-content-center pb-5">
                <h1 className="fw-bold py-3">
                  Find and join RIO&apos;s
                  <br />
                  at UH Mānoa
                </h1>
                <h2 className="pt-3">
                  Use the search bar to
                  <br />
                  search by category or
                  <br />
                  keywords, or browse below
                </h2>

                <div className="pt-3 d-flex justify-content-center">
                  <LandingSearchBar rioList={allRios} />
                </div>

                <div className="pt-4">
                  <ChevronDown />
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* TRENDING SECTION */}
        <Row className="bg-light p-4 g-0 justify-content-center">
          <Container className="pt-3 w-75">
            <h2 className="text-primary fw-bold text-start pb-4">Trending RIOs</h2>
            <div className="trending-panel">
              <Row xs={1} md={3} className="g-4 py-1">
                <RioCardDisplay rioList={trendingRios} />
              </Row>
            </div>
          </Container>
        </Row>
      </Container>

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
    </main>
  );
}
