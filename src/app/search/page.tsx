/* eslint-disable no-nested-ternary */
/* eslint-disable no-trailing-spaces */

'use client';

import { Col, Container, Row, Accordion, Form } from 'react-bootstrap';
import pageStyle from '@/utilities/pageStyle';
import { useState, useEffect } from 'react';
import fallbackTrendingRios from '@/utilities/trendingRIOS';
// import { IRIO } from '@/lib/validationSchemas';
// import { TrendingRio } from '@/lib/dbActions';
// import { prisma } from '@/lib/prisma';

export default function SearchPage() {
  const rioList = fallbackTrendingRios;

  const [searchQuery, setSearchQuery] = useState('');
  const [rios, setRios] = useState(rioList); // change fallbackTrendingRios to database ones
  const [filteredItems, setFilteredItems] = useState(fallbackTrendingRios);
  const [sortBy, setSortBy] = useState('trending');
  const [selectedType, setSelectedType] = useState('all');

  // implement this after seeding database
  // useEffect(() => {
  //   async function loadRios() {
  //     const response = await prisma.rio.findMany();
  //     const data = await response.json();
  //     setRios(data);
  //     setFilteredItems(data);
  //   }
  //   loadRios();
  // }, []);

  // sorting function
  const sortItems = (items, sortType: string) => {
    const sorted = [...items];

    switch (sortType) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'trending':
        return sorted;
      case 'reverse':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    const sortedRIOs = sortItems(filteredItems, sortType);
    setFilteredItems(sortedRIOs);
  };

  // eslint-disable-next-line consistent-return
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
      || item.interest.toLowerCase().includes(searchQuery.toLowerCase())
      || item.blurb.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
  
    // Filter by interest/type
    if (selectedType !== 'all') {
      results = results.filter(item => item.interest === selectedType);
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
                      <option value="alphabetical">Alphabetical (A-Z)</option>
                      <option value="reverse">Alphabetical (Z-A)</option>
                    </Form.Select>
                  </Col>
                </Row>
          
                <Row>
                  <Form.Label>Club Type</Form.Label>
                  <Col md={5}>
                    <Form.Check
                      className="py-1"
                      name="club-type"
                      type="radio"
                      id="none"
                      label="All"
                      checked={selectedType === 'all'}
                      onChange={(e) => handleInterest(e.target.value)}
                      value="all"
                    />
                    <Form.Check
                      className="py-1"
                      name="club-type"
                      type="radio"
                      id="ethnic-cultural"
                      label="Ethnic/Cultural"
                      value="Ethnic/Cultural"
                      checked={selectedType === 'Ethnic/Cultural'}
                      onChange={(e) => handleInterest(e.target.value)}
                    />
                    <Form.Check
                      className="py-1"
                      name="club-type"
                      type="radio"
                      id="fraternity-sorority"
                      label="Fraternity/Sorority"
                      value="Fraternity/Sorority"
                      checked={selectedType === 'Fraternity/Sorority'}
                      onChange={(e) => handleInterest(e.target.value)}
                    />
                    <Form.Check
                      className="py-1"
                      name="club-type"
                      type="radio"
                      id="religious-spiritual"
                      label="Religious/Spiritual"
                      value="Religious/Spiritual"
                      checked={selectedType === 'Religious/Spiritual'}
                      onChange={(e) => handleInterest(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Check
                      className="py-1"
                      name="club-type"
                      type="radio"
                      id="academic-professional"
                      label="Academic/Professional"
                      value="Academic/Professional"
                      checked={selectedType === 'Academic/Professional'}
                      onChange={(e) => handleInterest(e.target.value)}
                    />
                    <Form.Check
                      className="py-1"
                      name="club-type"
                      type="radio"
                      id="honorary-society"
                      label="Honorary Society"
                      value="Honorary-Society"
                      checked={selectedType === 'Honorary-Society'}
                      onChange={(e) => handleInterest(e.target.value)}
                    />
                    <Form.Check
                      className="py-1"
                      name="club-type"
                      type="radio"
                      id="sports-leisure"
                      label="Sports/Leisure"
                      value="Sports/Leisure"
                      checked={selectedType === 'Sports/Leisure'}
                      onChange={(e) => handleInterest(e.target.value)}
                    />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      <Row>
        <div className="trending-panel">
          <Row xs={1} md={3} className="g-4">
            {filteredItems.map((rio) => (
              <Col key={rio.id}>
                <div className="trending-card">
                  <h5 className="trending-card-title">{rio.name}</h5>
                  <p className="trending-card-text">{rio.blurb}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Row>
    </Container>
  );
}
