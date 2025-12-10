/* eslint-disable max-len */
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <main className="rb-help-page bg-light">
      {/* Top “hero” for the help page */}
      <br />
      <section className="rb-help-hero py-5">
        <Container className="text-center">
          <h1 className="fw-bold mb-3 text-primary">Welcome to RIBows</h1>
          <p className="lead mb-0">
            This guide walks you through how to create your profile, explore RIOs, bookmark RIOs, and get the most out
            of the site.
          </p>
        </Container>
      </section>

      {/* Main content */}
      <section className="py-5">
        <Container>
          <Row className="gy-4 align-items-center">
            <Col md={6}>
              <h2 className="fw-bold mb-3">1. Create your profile</h2>
              <p>
                Start by signing in and setting up your profile. Add your interests so RIBows can help you find RIOs
                that match what you&apos;re looking for at UH Mānoa.
              </p>
              <p className="mb-3">
                You can sign in from the top-right corner of the site, or go directly to the signup page:
              </p>
              <Link href="/auth/signup">
                <Button variant="primary">Go to signup</Button>
              </Link>
            </Col>

            <Col md={6} className="text-center">
              <Image
                src="/images/signup.png"
                width={500}
                alt="Screenshot of the RIBows signup page"
                className="img-fluid rounded shadow-sm"
              />
            </Col>
          </Row>

          <Row className="gy-4 mt-5">
            <Col md={6}>
              <h2 className="fw-bold mb-3">2. Explore RIOs</h2>
              <p>
                Once you&apos;re signed in, use the <a href="/search"><strong>Search</strong></a> page or the landing page search bar to
                browse RIOs by name, category, or keywords. You can also look through the <a href="/"><strong>Trending RIOs</strong></a>{' '}
                section on the home page to see what&apos;s popular.
              </p>
              <p>Click on a RIO card to see more details like purpose, main contact, and email information.</p>
              <Image
                src="/images/search.png"
                alt="Screenshot of the RIBows search page"
                className="img-fluid rounded shadow-sm"
              />
            </Col>

            <Col md={6}>
              <h2 className="fw-bold mb-3">3. Bookmark RIOs</h2>
              <p>
                When you find a RIO you like, click the bookmark icon on the card (or in the search results). Bookmarked
                RIOs are saved to your account so you can come back to them later.
              </p>
              <p>
                You can view your saved RIOs from the <a href="bookmarks"><strong>Bookmarks</strong></a> link in the navigation bar.
              </p>
              <br />
              <Image
                src="/images/bookmarks.png"
                alt="Screenshot of bookmarks pages"
                className="img-fluid rounded shadow-sm"
              />
            </Col>
          </Row>

          <Row className="gy-4 mt-5">
            <Col>
              <h2 className="fw-bold mb-3">4. Reach out and get involved</h2>
              <p>
                Ready to join or learn more? Use the <strong>Contact</strong> button on a RIO card to email the main
                contact directly from RIBows.
              </p>
              <p className="mb-0">
                Explore, bookmark, and connect with RIOs that match your interests—RIBows is here to make finding your
                community at UH Mānoa easier.
              </p>
            </Col>
            <Col>
              <Image
                src="/images/popup.png"
                alt="Screenshot of the popup"
                className="img-fluid rounded shadow-sm d-block mx-auto"
                style={{ maxWidth: '500px', height: '400' }}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
