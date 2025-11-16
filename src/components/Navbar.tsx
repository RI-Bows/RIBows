/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Image, Nav, Navbar } from 'react-bootstrap';
import { BoxArrowRight, PersonFill } from 'react-bootstrap-icons';
// eslint-disable-next-line import/extensions
import { ComponentIDs } from '@/utilities/ids';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const currentUser = session?.user?.email;
  // const userWithRole = session?.user as { email: string; randomKey: string };
  // const role = userWithRole?.randomKey;
  const menuStyle = { marginBottom: '0px' };
  const navbarClassName = currentUser ? 'bg-dark' : 'bg-light';
  // const navbarVariant = currentUser ? 'dark' : 'light';
  return (
    <Navbar expand="lg" style={menuStyle} className={navbarClassName}>
      <Container>
        <Navbar.Brand href="/" className="align-items-center">
          <span style={{ fontWeight: 800, fontSize: '24px' }}>
            <Image src="/images/logo.png" width={50} style={{ marginBottom: 3 }} alt="Bowfolios" />
            Bowfolios
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={ComponentIDs.basicNavbarNav} />
        <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
          <Nav className="me-auto justify-content-start">
            {currentUser ? (
              <Nav.Link id={ComponentIDs.homeMenuItem} active={pathname === '/home'} href="/home" key="home">
                Home
              </Nav.Link>
            ) : (
              ''
            )}
            <Nav.Link
              id={ComponentIDs.profilesMenuItem}
              active={pathname === '/profiles'}
              href="/profiles"
              key="profiles"
            >
              Profiles
            </Nav.Link>
            <Nav.Link
              id={ComponentIDs.projectsMenuItem}
              active={pathname === '/projects'}
              href="/projects"
              key="projects"
            >
              Projects
            </Nav.Link>
            <Nav.Link
              id={ComponentIDs.interestsMenuItem}
              active={pathname === '/interests'}
              href="/interests"
              key="interests"
            >
              Interests
            </Nav.Link>
            {currentUser
              ? [
                  <Nav.Link
                    id={ComponentIDs.addProjectMenuItem}
                    active={pathname === '/addProject'}
                    href="/addProject"
                    key="addP"
                  >
                    Add Project
                  </Nav.Link>,
                  <Nav.Link
                    id={ComponentIDs.filterMenuItem}
                    active={pathname === '/filter'}
                    href="/filter"
                    key="filter"
                  >
                    Filter
                  </Nav.Link>,
                ]
              : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser ? (
              <Nav.Link
                id={ComponentIDs.signoutMenuItem}
                active={pathname === '/auth/signout'}
                href="/auth/signout"
                key="signout"
              >
                <Container className="d-flex align-items-center gap-1">
                  <BoxArrowRight />
                  Signout
                </Container>
              </Nav.Link>
            ) : (
              <Nav.Link
                id={ComponentIDs.signinMenuItem}
                active={pathname === '/auth/signin'}
                href="/auth/signin"
                key="signin"
              >
                <Container className="d-flex align-items-center gap-1">
                  <PersonFill />
                  Sign In
                </Container>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
