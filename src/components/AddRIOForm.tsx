/* eslint-disable import/extensions */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { Form, Button, Col, Row, Container, Card } from 'react-bootstrap';
import { AddRIOSchema, IRIO } from '../lib/validationSchemas';

const AddRIOForm: React.FC = () => {
  const formPadding = 'py-1';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IRIO>({
    resolver: yupResolver(AddRIOSchema),
  });

  const onSubmit = (data: IRIO) => {
    // Mock-up function to simulate server action
    console.log('Mock Add RIO Data:', data);
    swal('Mockup', 'RIO Form Submitted (not yet saved to DB).', 'info');
    reset();
  };
  return (
    <Container className="py-3">
      <h2 className="text-center mb-3">Add RIO</h2>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* RIO Name / Category */}
            <Row className={formPadding}>
              <Col xs={6}>
                <Form.Group controlId="name">
                  <Form.Label column sm={2}>RIO Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('name')}
                    placeholder="Enter RIO Name"
                  />
                  <Form.Text className="text-danger">
                    {errors.name?.message}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group controlId="category">
                  <Form.Label column sm={2}>Category</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('category')}
                    placeholder="Sports/Leisure"
                  />
                  <Form.Text className="text-danger">
                    {errors.category?.message}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            {/* RIO Email / Image */}
            <Row className={formPadding}>
              <Col xs={6}>
                <Form.Group controlId="email">
                  <Form.Label column sm={2}>Club Email</Form.Label>
                  <Form.Control
                    type="email"
                    {...register('email')}
                    placeholder="foo@hawaii.edu"
                  />
                  <Form.Text className="text-danger">
                    {errors.email?.message}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group controlId="image">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('image')}
                    placeholder="http://example.com/image.jpg"
                  />
                  <Form.Text className="text-danger">
                    {errors.image?.message}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* RIO Description */}
            <Row className={formPadding}>
              <Col xs={12}>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register('description')}
                    placeholder="Brief description of the RIO"
                  />
                  <Form.Text className="text-danger">
                    {errors.description?.message}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* Buttons */}
            <Row className={formPadding}>
              <Col xs="auto">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Col>
              <Col xs="auto">
                <Button variant="warning" type="button" onClick={() => reset()}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddRIOForm;
