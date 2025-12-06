import { Container, Row } from 'react-bootstrap';
import { PageIDs } from '@/utilities/ids';
import RioCardDisplay from '@/components/RioCardDisplay';
import LandingSearchBar from '@/components/LandingSearchBar';
import { getTrendingRios, getRios, RioType } from '@/lib/dbActions';

export default async function Home() {
  const allRios: RioType[] = await getRios();
  const trendingRios: RioType[] = await getTrendingRios(9);

  return (
    <Container fluid className="g-0 pt-5 bg-primary">
      <div id={PageIDs.landingPage} className="home-background-image d-flex justify-content-center">
        <Container>
          <Row className="text-light text-center w-100 pt-5 row-gap-3">
            <h1 className="fw-bold pt-5">
              Find and join RIO&apos;s
              <br />
              at UH Mānoa
            </h1>
            <h3 className="pt-3">
              Use the search bar to
              <br />
              search for RIOs
            </h3>
            <Container className="pt-3 position-relative">
              <LandingSearchBar rioList={allRios} />
            </Container>
          </Row>
        </Container>
      </div>
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
  );
}
