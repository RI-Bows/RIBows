'use client';

import { useState, useEffect } from 'react';
import { Form, Button, Card, Toast, ToastContainer, Image, Row, Col } from 'react-bootstrap';

const defaultInterestOptions = [
  'Academic / Professional',
  'Leisure / Recreational',
  'Arts / Culture',
  'Sports',
  'Volunteering',
  'Other',
];

export default function EditRioForm({
  rio, interestOptions = defaultInterestOptions }: { rio: any; interestOptions: string[] }) {
  // use server-provided options when available
  const options = Array.isArray(interestOptions) && interestOptions.length > 0
    ? interestOptions
    : defaultInterestOptions;

  const [name, setName] = useState(rio.name);
  const [purposeStatement, setPurposeStatement] = useState(rio.purposeStatement || '');
  const [mainContact, setMainContact] = useState(rio.mainContact);
  const [email, setEmail] = useState(rio.email);
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

  const [interests, setInterests] = useState<string[]>(normalizeInterests());

  // Image state: existing URL, preview for newly selected file, and File object
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(rio?.image ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  // helper to update Rio on the server
  const addRio = async (data: {
    name: string;
    purposeStatement: string;
    mainContact: string;
    email: string;
    interests: string[];
    image?: string | null;
  }) => {
    const res = await fetch(`/api/rio/${rio.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const [showToast, setShowToast] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      let uploadedImageUrl: string | null = null;

      // upload image first if a new file was chosen
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);

        const uploadRes = await fetch(`/api/rio/${rio.id}/image`, {
          method: 'POST',
          body: fd,
        });

        if (!uploadRes.ok) throw new Error(await uploadRes.text());
        const uploadJson = await uploadRes.json();
        uploadedImageUrl = uploadJson.url ?? uploadJson.imageUrl ?? null;
      }

      // build payload from text inputs and interests
      const payload = {
        name,
        purposeStatement,
        mainContact,
        email,
        interests, // string[]
        ...(uploadedImageUrl ? { image: uploadedImageUrl } : {}),
      };

      // call helper to update DB
      await addRio(payload);

      // reflect changes locally
      if (uploadedImageUrl) setCurrentImageUrl(uploadedImageUrl);
      setShowToast(true);
    } catch (err: any) {
      console.error('Save failed', err);
      // optionally show an error toast/modal here
    }
  };

  return (
    <Card className="p-3 mb-4">
      <Form onSubmit={handleSubmit}>
        <Row>
          {/* Left column: inputs */}
          <Col md={7}>
            <Form.Group className="mb-2">
              <Form.Label>RIO Name</Form.Label>
              <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Purpose Statement</Form.Label>
              <Form.Control value={purposeStatement} onChange={(e) => setPurposeStatement(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Main Contact</Form.Label>
              <Form.Control value={mainContact} onChange={(e) => setMainContact(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Interests</Form.Label>

              {/* read-only box that looks like a select and displays badges */}
              <div
                className="form-control d-flex flex-wrap align-items-center gap-2 mb-2"
                style={{ minHeight: 37, padding: '6px 10px', backgroundColor: '#fff' }}
                role="group"
                aria-label="Selected interests"
              >
                {Array.isArray(interests) && interests.length > 0 ? (
                  interests.map((interest: string) => (
                    <span
                      key={interest}
                      className="badge bg-primary mb-1"
                      style={{ pointerEvents: 'none' }}
                      role="listitem"
                      aria-hidden
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <div className="text-muted">No interests</div>
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

            <Button className="mt-3" type="submit">Save Changes</Button>
          </Col>

          {/* Right column: image preview + upload */}
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
                variant="primary"
                className="mt-3"
                style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 999 }}
                onClick={() => window.history.back()}
              >
                Go back
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

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
