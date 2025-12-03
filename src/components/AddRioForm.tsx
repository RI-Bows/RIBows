/* eslint-disable import/extensions */

'use client';

import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { Form, Button, Col, Row, Card, Image } from 'react-bootstrap';

type Props = {
  rio?: any | null;
  interestOptions?: string[];
};

const defaultInterestOptions = [
  'Academic / Professional',
  'Leisure / Recreational',
  'Arts / Culture',
  'Sports',
  'Volunteering',
  'Other',
];

export default function AddRioForm({ rio = null, interestOptions = defaultInterestOptions }: Props) {
  const [submitting, setSubmitting] = useState(false);

  // controlled fields
  const [name, setName] = useState<string>(rio?.name ?? '');
  const [purposeStatement, setPurposeStatement] = useState<string>(rio?.purposeStatement ?? '');
  const [mainContact, setMainContact] = useState<string>(rio?.mainContact ?? '');
  const [email, setEmail] = useState<string>(rio?.email ?? '');
  const [interests, setInterests] = useState<string[]>(Array.isArray(rio?.interests) ? rio.interests : []);
  const [options, setOptions] = useState<string[]>(interestOptions ?? defaultInterestOptions);

  // image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(rio?.image ?? null);

  useEffect(() => {
    setOptions(interestOptions && interestOptions.length > 0 ? interestOptions : defaultInterestOptions);
  }, [interestOptions]);

  useEffect(() => () => {
    // cleanup preview object URL on unmount / change
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const handleInterestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setInterests(selected);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const resetForm = () => {
    setName(rio?.name ?? '');
    setPurposeStatement(rio?.purposeStatement ?? '');
    setMainContact(rio?.mainContact ?? '');
    setEmail(rio?.email ?? '');
    setInterests(Array.isArray(rio?.interests) ? rio.interests : []);
    setImageFile(null);
    setImagePreview(null);
    setCurrentImageUrl(rio?.image ?? null);
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      setSubmitting(true);

      // upload image if present
      let uploadedImageUrl: string | null = null;
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);

        const uploadRes = await fetch('/api/rio/image', {
          method: 'POST',
          body: fd,
        });

        if (!uploadRes.ok) {
          throw new Error(`Image upload failed (${uploadRes.status})`);
        }

        const uploadJson = await uploadRes.json();
        uploadedImageUrl = uploadJson.url ?? uploadJson.imageUrl ?? null;
      }

      const payload: any = {
        name,
        purposeStatement,
        mainContact,
        email,
        interests,
      };

      if (uploadedImageUrl) payload.image = uploadedImageUrl;
      else if (currentImageUrl) payload.image = currentImageUrl;

      const endpoint = rio ? `/api/rio/${rio.id}` : '/api/rio';
      const method = rio ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Save failed (${res.status})`);
      }

      swal('Success', rio ? 'RIO updated' : 'RIO added', 'success', { timer: 2000 });
      resetForm();
    } catch (err: any) {
      console.error(err);
      swal('Error', err?.message ?? 'Save failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // compute submit button label without nested ternary
  let submitLabel = 'Submit';
  if (submitting) submitLabel = 'Saving…';
  else if (rio) submitLabel = 'Save Changes';

  return (
    <Card className="py-3 mb-4">
      <Card.Body>
        <Form onSubmit={onSubmit}>
          <Row className="mb-3">
            <Col md={7}>
              <Form.Group controlId="name" className="mb-2">
                <Form.Label>RIO Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter RIO Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Purpose Statement</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter Purpose Statement"
                  value={purposeStatement}
                  onChange={(e) => setPurposeStatement(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Main Contact</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name of Main Contact Person"
                  value={mainContact}
                  onChange={(e) => setMainContact(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter RIO Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Interests</Form.Label>
                <div
                  className="form-control d-flex flex-wrap align-items-center gap-2 mb-2"
                  style={{ minHeight: 37, padding: '6px 10px', backgroundColor: '#fff' }}
                  role="group"
                  aria-label="Selected interests"
                >
                  {interests && interests.length > 0 ? (
                    interests.map((interest) => (
                      <span key={interest} className="badge bg-primary mb-1" style={{ pointerEvents: 'none' }}>
                        {interest}
                      </span>
                    ))
                  ) : (
                    <div className="text-muted">Select an interest</div>
                  )}
                </div>

                <Form.Select multiple value={interests} onChange={handleInterestsChange}>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="mt-3">
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitLabel}
                </Button>{' '}
              </div>
            </Col>

            <Col md={5}>
              <Form.Group className="mb-2">
                <Form.Label>Image</Form.Label>
                <div className="mb-2 d-flex justify-content-center">
                  {(() => {
                    if (imagePreview) {
                      return (
                        <Image
                          src={imagePreview}
                          alt="New preview"
                          thumbnail
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      );
                    }
                    if (currentImageUrl) {
                      return (
                        <Image
                          src={currentImageUrl}
                          alt="Current image"
                          thumbnail
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      );
                    }
                    return <div>No image</div>;
                  })()}
                </div>

                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                <Form.Text className="text-muted">Choose a new image to replace the existing one.</Form.Text>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-secondary"
                  className="mt-3"
                  style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 999 }}
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

// provide defaults for non-required props to satisfy eslint react/require-default-props
AddRioForm.defaultProps = {
  rio: null,
  interestOptions: defaultInterestOptions,
};
