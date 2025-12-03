import { Container, Row, Col, Image } from 'react-bootstrap';
import { PageIDs } from '@/utilities/ids';
import RioCardDisplay from '@/components/RIOCardDisplay';
import { RioType } from '@/lib/dbActions';

export default async function Home() {
  // EC 11/24/25 - Commenting this out for now–see dbActions
  // Fetch trending RIOs from the database
  // let trendingRios = await getTrendingRios(9);

  // If no trending RIOs found, use fallback data
  // if (trendingRios.length === 0) {
  //   trendingRios = fallbackTrendingRios;
  // }
  // EC 11/28/25 - Moving this here for now so we know to replace with future getter function
  //               Also refactoring to match the current RIO type
  const fallbackTrendingRios: RioType[] = [
    {
      id: 1,
      name: 'Ka Mea Kolo',
      purposeStatement: "Shares enthusiasm for Earth's diverse creatures, especially those that call Hawai'i home.",
      mainContact: 'Britney Pham',
      email: 'phambrit@hawaii.edu',
      approvalDate: new Date('2026-01-20'),
      expirationDate: new Date('2027-01-20'),
      interestId: 1,
      bookmarks: 0,
      image: null,
      interest: { name: 'Academic/Professional' },
    },
    {
      id: 2,
      name: 'Women in STEM',
      purposeStatement: 'Support, and elevate students who identify as women pursuing degrees in STEM.',
      mainContact: 'Britney Pham',
      email: 'phambrit@hawaii.edu',
      approvalDate: new Date('2026-01-20'),
      expirationDate: new Date('2027-01-20'),
      interestId: 1,
      bookmarks: 0,
      image: null,
      interest: { name: 'Academic/Professional' },
    },
    {
      id: 3,
      name: 'Natural Sciences Student Ambassadors',
      // eslint-disable-next-line max-len
      purposeStatement: 'Promote a welcoming and inclusive community for all students pursuing a degree in the Natural Sciences',
      mainContact: 'Britney Pham',
      email: 'phambrit@hawaii.edu',
      approvalDate: new Date('2026-01-20'),
      expirationDate: new Date('2027-01-20'),
      interestId: 1,
      bookmarks: 0,
      image: null,
      interest: { name: 'Academic/Professional' },
    },
    {
      id: 4,
      name: 'K-pop Cardio Crew ',
      purposeStatement: 'Creating a supportive community for students who love K-Pop and dancing.',
      mainContact: 'Britney Pham',
      email: 'phambrit@hawaii.edu',
      approvalDate: new Date('2026-01-20'),
      expirationDate: new Date('2027-01-20'),
      interestId: 2,
      bookmarks: 0,
      image: null,
      interest: { name: 'Leisure/Recreational' },
    },
    {
      id: 5,
      name: 'Beta Beta Gamma Sorority',
      // eslint-disable-next-line max-len
      purposeStatement: 'Cultivate lifelong friendships, celebrate diversity, and make meaningful contributions to society.',
      mainContact: 'Britney Pham',
      email: 'phambrit@hawaii.edu',
      approvalDate: new Date('2026-01-20'),
      expirationDate: new Date('2027-01-20'),
      interestId: 3,
      bookmarks: 0,
      image: null,
      interest: { name: 'Fraternity/Sorority' },
    },
    {
      id: 6,
      name: 'Cafe Hoppers',
      purposeStatement: 'We also explore and engage with small businesses owners within our community.',
      mainContact: 'Britney Pham',
      email: 'phambrit@hawaii.edu',
      approvalDate: new Date('2026-01-20'),
      expirationDate: new Date('2027-01-20'),
      interestId: 2,
      bookmarks: 0,
      image: null,
      interest: { name: 'Leisure/Recreational' },
    },
    {
      id: 7,
      name: 'Chinese Club',
      // eslint-disable-next-line max-len
      purposeStatement: 'Create a community to learn, appreciate, and celebrate aspects of Chinese culture and language.',
      mainContact: 'Britney Pham',
      email: 'phambrit@hawaii.edu',
      approvalDate: new Date('2026-01-20'),
      expirationDate: new Date('2027-01-20'),
      interestId: 4,
      bookmarks: 0,
      image: null,
      interest: { name: 'Ethnic/Cultural' },
    },
    {
      id: 8,
      name: 'Hawaii Powerlifting Club',
      purposeStatement: 'Create a team that can represent the University at local,  state, and national competitions.',
      mainContact: 'Britney Pham',
      email: 'phambrit@hawaii.edu',
      approvalDate: new Date('2026-01-20'),
      expirationDate: new Date('2027-01-20'),
      interestId: 5,
      bookmarks: 0,
      image: null,
      interest: { name: 'Sports/Leisure' },
    },
    {
      id: 9,
      name: 'Inspire Church YA',
      // eslint-disable-next-line max-len
      purposeStatement: 'Provide a Christ- community where students can grow in their faith and build relationships. Provide a Christ- community where students can grow in their faith and build relationships.Provide a Christ- community where students can grow in their faith and build relationships.Provide a Christ- community where students can grow in their faith and build relationships.',
      mainContact: 'Britney Pham',
      email: 'phambrit@hawaii.edu',
      approvalDate: new Date('2026-01-20'),
      expirationDate: new Date('2027-01-20'),
      interestId: 6,
      bookmarks: 0,
      image: null,
      interest: { name: 'Religious/Spiritual' },
    },
  ];

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
                <Row xs={1} md={3} className="g-4 py-1">
                  <RioCardDisplay rioList={fallbackTrendingRios} />
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
