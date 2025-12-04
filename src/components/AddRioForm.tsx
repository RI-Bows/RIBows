/* eslint-disable import/extensions */

'use client';

import React, { useEffect, useState } from 'react';
import { Form, Button, Col, Row, Card, Image, Toast, ToastContainer } from 'react-bootstrap';

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
  // use server-provided options when available
  const options = Array.isArray(interestOptions) && interestOptions.length > 0
    ? interestOptions
    : defaultInterestOptions;

  // Normalize incoming rio interests into a string[] so .map is always safe
  const normalizeInterests = (): string[] => {
    if (Array.isArray(rio?.RioInterest) && rio.RioInterest.length > 0) {
      // RioInterest entries might be objects; extract a name field if present
      return rio.RioInterest.map((ri: any) => ri.name ?? ri.interest?.name ?? String(ri));
    }
    if (rio?.interest) {
      // singular relation case
      return [rio.interest.name ?? String(rio.interest)];
    }
    return [];
  };

  // controlled fields
  const [name, setName] = useState(rio?.name ?? '');
  const [purposeStatement, setPurposeStatement] = useState(rio?.purposeStatement ?? '');
  const [mainContact, setMainContact] = useState(rio?.mainContact ?? '');
  const [email, setEmail] = useState(rio?.email ?? '');
  const [interests, setInterests] = useState(normalizeInterests());

  // image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(rio?.image ?? null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return () => {};
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const handleInterestsChange = (e: any) => {
    const selected = Array.from(e.target.selectedOptions as HTMLOptionElement[]).map(o => o.value);
    setInterests(selected);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
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

  // helper to add Rio on the server
  const saveRio = async (data: {
    name: string;
    purposeStatement: string;
    mainContact: string;
    email: string;
    interests: string[];
    image?: string | null;
  }) => {
    const url = rio?.id ? `/api/rio/${rio.id}` : '/api/rio';
    const method = rio?.id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const [showToast, setShowToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
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
        ...(uploadedImageUrl ? { image: uploadedImageUrl } : {}),
      };

      // call helper to update DB
      await saveRio(payload);

      // reflect changes locally
      if (uploadedImageUrl) setCurrentImageUrl(uploadedImageUrl);
      setShowToast(true);
    } catch (err: any) {
      console.error('Save failed', err);
      // optionally show an error toast/modal here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="py-3 mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
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
              <Button className="mt-3" type="submit">Submit</Button>
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
      <ToastContainer position="middle-center" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>RIO updated!</Toast.Body>
        </Toast>
      </ToastContainer>
    </Card>
  );
}

// provide defaults for non-required props to satisfy eslint react/require-default-props
AddRioForm.defaultProps = {
  rio: null,
  interestOptions: defaultInterestOptions,
};
