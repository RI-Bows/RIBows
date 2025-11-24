import { Container, Row, Col, Image } from 'react-bootstrap';
import { PageIDs } from '@/utilities/ids';
import { getTrendingRios, type TrendingRio } from '@/lib/dbActions';

const fallbackTrendingRios: TrendingRio[] = [
  { id: 1,
    name: 'Ka Mea Kolo',
    blurb: "Shares enthusiasm for Earth's diverse creatures, especially those that call Hawai'i home.",
    count: 0,
  },
  { id: 2,
    name: 'Women in STEM',
    blurb: 'Support, empower, and elevate students who identify as women pursuing degrees in STEM.',
    count: 0,
  },
  { id: 3,
    name: 'Natural Sciences Student Ambassadors',
    blurb: 'Promote a welcoming and inclusive community for all students pursuing a degree in the Natural Sciences',
    count: 0,
  },
  { id: 4,
    name: 'K-pop Cardio Crew ',
    blurb: 'Creating a supportive community for students who love K-Pop and dancing.',
    count: 0,
  },
  { id: 5,
    name: 'Beta Beta Gamma Sorority',
    blurb: 'Cultivate lifelong friendships, celebrate diversity, and make meaningful contributions to society.',
    count: 0,
  },
  { id: 6,
    name: 'Cafe Hoppers',
    blurb: 'We also explore and engage with small businesses owners within our community.',
    count: 0,
  },
  { id: 7,
    name: 'Chinese Club',
    blurb: 'Create a community to learn, appreciate, and celebrate aspects of Chinese culture and language.',
    count: 0,
  },
  { id: 8,
    name: 'Hawaii Powerlifting Club',
    blurb: 'Create a team that can represent the University at local,  state, and national competitions.',
    count: 0,
  },
  { id: 9,
    name: 'Inspire Church YA',
    blurb: 'Provide a Christ-centered community where students can grow in their faith and build relationships.',
    count: 0,
  },
];

export default async function Home() {
  // Fetch trending RIOs from the database
  let trendingRios = await getTrendingRios(9);

  // If no trending RIOs found, use fallback data
  if (trendingRios.length === 0) {
    trendingRios = fallbackTrendingRios;
  }

  return (
    <main>
      <div id={PageIDs.landingPage}>
        <div className="Hero-background-image">
          <section className="Hero-section">
            <Container className="text-center">
              <h1 className="hero-simple-subtitle py-3">
                Find and join RIO&apos;s
                <br />
                at UH Mānoa
              </h1>
              <h2 className="hero-simple-subtitle-under">
                Use the search tab to
                <br />
                search by category, tag, or
                <br />
                keywords, or browse below
              </h2>
            </Container>
          </section>

          {/* Trending RIOs Page */}
          <section className="trending-section py-5">
            <Container>
              <h2 className="trending-heading text-start">
                Trendy RIOs
              </h2>
              <div className="trending-panel">
                <Row xs={1} md={3} className="g-4">
                  {fallbackTrendingRios.map((rio) => (
                    <Col key={rio.id}>
                      <div className="trending-card">
                        <h5 className="trending-card-title">{rio.name}</h5>
                        <p className="trending-card-text">{rio.blurb}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Container>
          </section>
        </div>
        {/* Rest of the Landing Page */}
        <Container className="text-center section-spacing">
          <h2
            style={{ paddingTop: '100px', color: 'black', fontSize: '36pt' }}
          >
            Welcome to RIBows!
          </h2>
          <p style={{ paddingBottom: '20px', color: 'black', fontSize: '18pt' }}>
            Create your profile, add your interest, and then explore and bookmark
            clubs or RIO&apos;s that match what you&apos;re looking for at UH Manoa
          </p>
        </Container>
        <div className="landing-white-background section-spacing">
          <Container className="justify-content-center text-center">
            <h3 style={{ color: 'black', marginBottom: '20px', fontSize: '28pt' }}>
              Start by making your profile
            </h3>
            <h5 style={{ color: 'black', marginBottom: '1.5rem' }}>
              Either by clicking sign in at the top right or clicking
              <a href="/auth/signup" style={{ marginLeft: '4px' }}>here</a>
            </h5>
            <Row md={1} lg={2} className="justify-content-center">
              <Col xs={12} md={6}>
                <Image src="/images/signup.png" width={500} alt="signup" />
              </Col>
            </Row>
          </Container>
        </div>
        <div className="landing-white-background section-spacing">
          <Container className="justify-content-center text-center">
            <h3 style={{ paddingTop: '20px', color: '#000000ff', marginBottom: '2.5rem', fontSize: '28pt' }}>
              Then you&apos;re all set up!
              <br />
              Explore, bookmark, and see what&apos;s trending!
            </h3>
            <Row md={1} lg={2} className="g-4 justify-content-center">
              <Col xs={12} md={4}>
                <h3 style={{ color: '#000000ff' }}>
                  Explore RIO&apos;s with the search tab that match your interests!
                </h3>
                {/* <Image
                  src="/images/interests-page.png"
                  width={500}
                  alt="interest-page"
                  className="img-fluid shadow-sm rounded"
                /> */}
              </Col>
              <Col xs={12} md={4}>
                <h3 style={{ color: '#000000ff' }}>
                  Bookmark them to join later or contact them directly through the app.
                </h3>
                {/* <Image
                  src="/images/filter-page.png"
                  width={500}
                  alt="filter-page"
                  className="img-fluid shadow-sm rounded"
                /> */}
              </Col>
              <Col xs={6} className="mx-auto py-3">
                {/* <h3 style={{ color: '#000000ff' }}>
                  Or look at our most trending tab to see what&apos;s popular!
                </h3>
                <Image
                  src="/images/filter-page.png"
                  width={500}
                  alt="filter-page"
                  className="img-fluid shadow-sm rounded"
                /> */}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </main>
  );
}
