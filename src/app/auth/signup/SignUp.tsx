'use client';

import { signIn } from 'next-auth/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Card, Col, Container, Button, Form, Row } from 'react-bootstrap';
import { createUser } from '@/lib/dbActions';
import Multiselect from 'multiselect-react-dropdown';
import { Interest } from '@prisma/client';

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

  const multiselectRef = useRef<any>(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
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
    // console.log(JSON.stringify(data, null, 2));
    await createUser(data, selectedInterests);
    // After creating, signIn with redirect to the add page
    await signIn('credentials', { callbackUrl: '/add', ...data });
  };

  const handleClear = () => {
    reset();
    setSelectedInterests([]);
    multiselectRef.current?.resetSelectedValues();
  };

  return (
    <main>
      <Container>
        <Row className="pt-5 justify-content-center">
          <Col xs={5}>
            <h1 className="text-center">Sign Up</h1>
            <Card>
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
                    <Multiselect
                      options={interests} // Options to display in the dropdown
                      ref={multiselectRef}
                      onSelect={(list) => setSelectedInterests(list)} // Function will trigger on select event
                      onRemove={(list) => setSelectedInterests(list)} // Function will trigger on remove event
                      displayValue="name" // Property name to display in the dropdown options
                      placeholder=""
                    />
                  </Form.Group>

                  <Form.Group className="form-group pt-3">
                    <Row>
                      <Col>
                        <Button type="submit" className="btn btn-primary">
                          Register
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
                Already have an account?
                &nbsp;
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
