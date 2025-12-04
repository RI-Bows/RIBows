'use client';

import { signIn } from 'next-auth/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Card, Col, Container, Button, Form, Row, Toast, ToastContainer } from 'react-bootstrap';
import { createUser, getUser } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import Multiselect from 'multiselect-react-dropdown';
import { Interest } from '@prisma/client';
import { CaretDownFill } from 'react-bootstrap-icons';

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpProps = {
  interests: Interest[];
};

/** The sign up page. */
const SignUp = ({ interests }: SignUpProps) => {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastBg, setToastBg] = useState<'success' | 'danger' | 'info'>('danger');

  const multiselectRef = useRef<any>(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid')
      .matches(/^[A-Z0-9._%+-]+@hawaii\.edu$/i, 'Email must be a @hawaii.edu address'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
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
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    setLoading(true);
    try {
      // Pre-check for duplicate
      const existing = await getUser(data.email);
      if (existing) {
        setToastBg('danger');
        setToastMessage('An account with that email already exists. Try signing in or resetting your password.');
        setToastShow(true);
        setLoading(false);
        return;
      }

      await createUser(data, selectedInterests);
      // After creating, signIn with redirect to the add page
      setToastBg('success');
      setToastMessage('Account created — signing you in...');
      setToastShow(true);
      await signIn('credentials', { callbackUrl: '/', ...data });
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = err;
      if (e?.message === 'INVALID_DOMAIN') {
        setToastBg('danger');
        setToastMessage('Email must be a @hawaii.edu address.');
      } else if (e?.message === 'DUPLICATE_EMAIL') {
        setToastBg('danger');
        setToastMessage('An account with that email already exists. Try signing in.');
      } else {
        setToastBg('danger');
        setToastMessage('Unexpected server error. Please try again later.');
      }
      setToastShow(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    reset();
    setSelectedInterests([]);
    multiselectRef.current?.resetSelectedValues();
  };

  return (
    <main>
      <Container fluid className="pt-5 p-4 bg-white">
        <ToastContainer
          className="p-3"
          position="top-center"
          style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1060,
          }}
        >
          <Toast onClose={() => setToastShow(false)} show={toastShow} bg={toastBg} delay={5000} autohide>
            <Toast.Body className={toastBg === 'danger' ? 'text-white' : ''}>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
        <Row className="pt-5 py-3 mb-3 justify-content-center">
          <Col xs={8}>
            <h1 className="text-center">Sign Up</h1>
            <Card className="shadow-sm mt-3">
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="form-group">
                    <Form.Label>Email</Form.Label>
                    <input
                      type="text"
                      {...register('email')}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                  </Form.Group>

                  <Form.Group className="form-group pt-2">
                    <Form.Label>Password</Form.Label>
                    <input
                      type="password"
                      {...register('password')}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                  </Form.Group>
                  <Form.Group className="form-group pt-2">
                    <Form.Label>Confirm Password</Form.Label>
                    <input
                      type="password"
                      {...register('confirmPassword')}
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                  </Form.Group>
                  <Form.Group className="form-group pt-2">
                    <Form.Label>Interests</Form.Label>
                    <div className="position-relative">
                      <Multiselect
                        options={interests}
                        ref={multiselectRef}
                        onSelect={(list) => setSelectedInterests(list)}
                        onRemove={(list) => setSelectedInterests(list)}
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

                  <Form.Group className="form-group pt-3">
                    <Row>
                      <Col>
                        <Button type="submit" className="btn btn-primary" disabled={loading}>
                          {loading ? <LoadingSpinner /> : 'Register'}
                        </Button>
                      </Col>
                      <Col>
                        <Button type="button" onClick={handleClear} className="btn btn-primary float-right">
                          Clear
                        </Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form>
              </Card.Body>
              <Card.Footer>
                Already have an account? &nbsp;
                <a href="/auth/signin">Sign in</a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignUp;
