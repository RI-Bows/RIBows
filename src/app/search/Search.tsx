/* eslint-disable no-nested-ternary */
/* eslint-disable no-trailing-spaces */

'use client';

import { Col, Container, Row, Accordion, Form } from 'react-bootstrap';
import pageStyle from '@/utilities/pageStyle';
import { useState, useEffect } from 'react';
import { RioType } from '@/lib/dbActions';
import { Interest } from '@prisma/client';
import RIOCardDisplay from '@/components/RIOCardDisplay';

// import { IRIO } from '@/lib/validationSchemas';
// import { prisma } from '@/lib/prisma';

type SearchProps = {
  rioList: RioType[];
  interests: Interest[];
};

export default function SearchPage({ rioList, interests }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [rios] = useState<RioType[]>(rioList);
  const [filteredItems, setFilteredItems] = useState<RioType[]>(rioList);
  const [sortBy, setSortBy] = useState('trending');
  const [selectedType, setSelectedType] = useState('all');
  const interestOptions = ['all', ...interests.map((i) => i.name)];

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
    setSelectedType(interest); // Just update state, let useEffect do the rest
  };

  // Update your useEffect to handle interest filtering
  useEffect(() => {
    let results = rios;

    // Filter by search query
    if (searchQuery !== '') {
      results = results.filter(
        item => item.name.toLowerCase().includes(searchQuery.toLowerCase())
          || item.interest.name.toLowerCase().includes(searchQuery.toLowerCase())
          || item.purposeStatement?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by interest/type
    if (selectedType !== 'all') {
      results = results.filter(item => item.interest.name === selectedType);
    }

    // Apply sorting
    setFilteredItems(sortItems(results, sortBy));
  }, [searchQuery, rios, sortBy, selectedType]);

  return (
    <Container style={pageStyle}>
      <Row>
        <Col className="text-center">
          <h1>Search for Clubs</h1>
        </Col>
      </Row>
      <Row className="py-3">
        <input
          type="text"
          value={searchQuery}
          placeholder="Search for clubs..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block
                    w-full
                    pl-10
                    pr-4
                    py-3 border border-gray-300 rounded-5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </Row>
      <Row>
        <Col md={5}>
          <Accordion defaultActiveKey="" className="pb-3">
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
      <Row>
        <div className="trending-panel py-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No clubs match your search.</p>
            </div>
          ) : (
            <Row xs={1} md={3} className="g-4 py-1">
              <RIOCardDisplay rioList={filteredItems} />
            </Row>
          )}
        </div>
      </Row>
    </Container>
  );
}
