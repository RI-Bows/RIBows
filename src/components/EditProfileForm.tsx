/* eslint-disable arrow-body-style */

'use client';

import React, { useRef, useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Interest } from '@prisma/client';
import { updateUser } from '@/lib/dbActions';
import Multiselect from 'multiselect-react-dropdown';
import { CaretDownFill, ArrowLeft } from 'react-bootstrap-icons';

type EditClubForm = {
  email: string;
  password?: string;
};

const defaultInterestOptions = [
  'Academic / Professional',
  'Leisure / Recreational',
  'Arts / Culture',
  'Sports',
  'Volunteering',
  'Other',
];

export default function EditProfileForm({
  user,
  interestOptions = defaultInterestOptions,
}: {
  user: any;
  interestOptions: string[];
}) {
  const options = Array.isArray(interestOptions) && interestOptions.length > 0
    ? interestOptions : defaultInterestOptions;

  const normalizeInterests = (): string[] => {
    if (Array.isArray(user?.Interests) && user.Interests.length > 0) {
      // RioInterest entries might be objects; extract a name field if present
      return user.Interests.map((u: any) => u.name ?? u.interest?.name ?? String(u));
    }
    if (user?.interest) {
      // singular relation case
      return [user.interest.name ?? String(user.interest)];
    }
    return [];
  };

  const [selectedInterests, setSelectedInterests] = useState<string[]>(normalizeInterests());
  const [loading, setLoading] = useState(false);

  const multiselectRef = useRef<any>(null);
  const router = useRouter();

  const EditProfileSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid')
      .matches(/^[A-Z0-9._%+-]+@hawaii\.edu$/i, 'Email must be a @hawaii.edu address'),
    interests: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().min(1, 'Must be at least 1').required('Interest id is required'),
        name: Yup.string().required('Interest name is required'),
      }),
    ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditClubForm>({
    resolver: yupResolver(EditProfileSchema),
  });

  const onSubmit = async (data: EditClubForm) => {
    setLoading(true);
    try {
      // prefer form email but fall back to local state
      const emailFromForm = data.email?.trim();

      // selected interests come from the local interests state (string[] of names)
      const selected = selectedInterests ?? [];

      // normalize to Interest[] handling strings, objects with { name } or nested { interest: { name } }
      const normalized: Interest[] = (Array.isArray(selected) ? selected : [])
        .map((it: any) => {
          if (typeof it === 'string') return { name: it } as Interest;
          if (!it) return { name: '' } as Interest;
          if (typeof it === 'object') {
            if ('name' in it && typeof it.name === 'string') {
              return 'id' in it && typeof it.id === 'number'
                ? ({ id: it.id, name: it.name } as Interest)
                : ({ name: it.name } as Interest);
            }
            if (it.interest && typeof it.interest.name === 'string') {
              return { name: it.interest.name } as Interest;
            }
          }
          return { name: String(it) } as Interest;
        })
        .filter((i) => i.name && i.name.trim().length > 0);

      await updateUser(user.id, emailFromForm, normalized);
      swal('Success', 'Your profile has been updated', 'success', { timer: 2000 });
    } catch (err) {
      // log & notify user
      // eslint-disable-next-line no-console
      console.error(err);
      swal('Error', 'Unable to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Container>
        <Card className="shadow-sm p-3 mb-4">
          <div className="mb-3">
            <Button
              variant="outline-secondary"
              size="sm"
              className="border-0"
              onClick={() => router.push('/')}
              aria-label="Return Home"
            >
              <ArrowLeft className="me-2" />
              Return Home
            </Button>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <input
                type="text"
                {...register('email')}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter email"
                defaultValue={user?.email}
              />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </Form.Group>

            <Form.Group className="form-group pt-2">
              <Form.Label>Interests</Form.Label>
              <div className="position-relative">
                <Multiselect
                  options={options.map((opt) => ({ name: opt }))}
                  selectedValues={selectedInterests.map((it) => ({ name: it }))}
                  ref={multiselectRef}
                  onSelect={(list: any[]) => setSelectedInterests(list.map((i) => i.name))}
                  onRemove={(list: any[]) => setSelectedInterests(list.map((i) => i.name))}
                  displayValue="name"
                  placeholder=""
                />
                <CaretDownFill
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#6c757d',
                  }}
                  aria-hidden
                />
              </div>
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center pt-3">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  reset();
                  setSelectedInterests(normalizeInterests());
                  if (multiselectRef.current) {
                    multiselectRef.current.resetSelectedValues();
                  }
                }}
              >
                Clear
              </Button>
            </div>
          </Form>

          {/* <Card className="mt-3 p-3">
            <h5>Preview</h5>
            <p>
              <strong>Email:</strong>
              &nbsp;
              {user?.email ?? '—'}
            </p>
            <p>
              <strong>Interests:</strong>
              &nbsp;
              {user?.interests?.length ? user.interests.map((i) => i.name).join(', ') : '—'}
            </p>
          </Card> */}
        </Card>
      </Container>
    </main>
  );
}
