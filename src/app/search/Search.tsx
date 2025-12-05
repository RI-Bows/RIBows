/* eslint-disable no-nested-ternary */
/* eslint-disable no-trailing-spaces */

'use client';

import { Col, Container, Row, Accordion, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { RioType } from '@/lib/dbActions';
import { Interest } from '@prisma/client';
import RioCardDisplay from '@/components/RioCardDisplay';

// import { IRIO } from '@/lib/validationSchemas';
// import { prisma } from '@/lib/prisma';

type SearchProps = {
  rioList: RioType[];
  interests: Interest[];
  // eslint-disable-next-line react/require-default-props
  initialQuery?: string;
};

export default function Search({ rioList, interests, initialQuery = '' }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [rios] = useState<RioType[]>(rioList);
  const [filteredItems, setFilteredItems] = useState<RioType[]>(rioList);
  const [sortBy, setSortBy] = useState('trending');
  const [selectedType, setSelectedType] = useState('all');
  const interestOptions = ['all', ...interests.map((i) => i.name)];

  // If the initialQuery prop changes (new URL), sync it into local state
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // sorting function
  const sortItems = (items: RioType[], sortType: string) => {
    const sorted = [...items];

    switch (sortType) {
      case 'trending':
        return sorted.sort((a, b) => b.bookmarks - a.bookmarks);
      case 'newest':
        return sorted.sort((a, b) => b.approvalDate.getTime() - a.approvalDate.getTime());
      case 'oldest':
        return sorted.sort((a, b) => a.approvalDate.getTime() - b.approvalDate.getTime());
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'en', { ignorePunctuation: true }));
      case 'reverse':
        return sorted.sort((a, b) => b.name.localeCompare(a.name, 'en', { ignorePunctuation: true }));
      default:
        return sorted;
    }
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    const sortedRIOs = sortItems(filteredItems, sortType);
    setFilteredItems(sortedRIOs);
  };

  const handleInterest = (interest: string) => {
    setSelectedType(interest);
  };

  // useEffect handles interest filtering
  useEffect(() => {
    let results = rios;

    // Filter by search query
    if (searchQuery !== '') {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (item) => item.name.toLowerCase().includes(q)
          || item.interest.name.toLowerCase().includes(q)
          || item.purposeStatement?.toLowerCase().includes(q),
      );
    }

    // Filter by interest/type
    if (selectedType !== 'all') {
      results = results.filter((item) => item.interest.name === selectedType);
    }

    // Apply sorting
    setFilteredItems(sortItems(results, sortBy));
  }, [searchQuery, rios, sortBy, selectedType]);

  return (
    <Container fluid className="pt-5">
      <Row className="g-0 p-4">
        <Container className="pt-4 w-75">
          <h2 className="text-primary fw-bold text-center">
            Search for RIOs
          </h2>
        </Container>
      </Row>
      <Row className="justify-content-center p-4 w-75 mx-auto">
        <Col md={8} className="pe-2">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-100 py-3 border border-gray-300 rounded-5"
          />
        </Col>
        <Col md={4}>
          <Accordion defaultActiveKey="">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Filters</Accordion.Header>
              <Accordion.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Sort By</Form.Label>
                    <Form.Select
                      value={sortBy}
                      onChange={(e) => handleSort(e.target.value)}
                    >
                      <option value="trending">Trending</option>
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="alphabetical">Alphabetical (A-Z)</option>
                      <option value="reverse">Alphabetical (Z-A)</option>
                    </Form.Select>
                  </Col>
                </Row>

                <Row>
                  <Form.Label>Club Type</Form.Label>

                  <Col xs={12} sm={12} xl={6}>
                    {interestOptions.slice(0, 6).map((interestName) => (
                      <Form.Check
                        key={interestName}
                        className="py-1"
                        name="club-type"
                        type="radio"
                        id={`interest-${interestName === 'all' ? 'all' : interestName}`}
                        label={interestName === 'all' ? 'All' : interestName}
                        value={interestName}
                        checked={selectedType === interestName}
                        onChange={(e) => handleInterest(e.target.value)}
                      />
                    ))}
                  </Col>
                  <Col xs={12} sm={12} xl={6}>
                    {interestOptions.slice(6).map((interestName) => (
                      <Form.Check
                        key={interestName}
                        className="py-1"
                        name="club-type"
                        type="radio"
                        id={`interest-${interestName}`}
                        label={interestName}
                        value={interestName}
                        checked={selectedType === interestName}
                        onChange={(e) => handleInterest(e.target.value)}
                      />
                    ))}
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      <Row className="bg-light justify-content-center p-4">
        <Container className="pt-4 w-75">
          <div className="trending-panel">
            {filteredItems.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No clubs match your search.</p>
              </div>
            ) : (
              <Row xs={1} md={3} className="g-4 py-1">
                <RioCardDisplay rioList={filteredItems} />
              </Row>
            )}
          </div>
        </Container>
      </Row>
    </Container>
  );
}
