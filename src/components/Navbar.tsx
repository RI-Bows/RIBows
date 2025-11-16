/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, Pen } from 'react-bootstrap-icons';
// eslint-disable-next-line import/extensions
import { ComponentIDs } from '@/utilities/ids';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const currentUser = session?.user?.email;
  // const userWithRole = session?.user as { email: string; randomKey: string };
  const role = (session?.user as any)?.role ?? null;
  const menuStyle = { marginBottom: '0px' };
  const navbarClassName = currentUser ? 'bg-dark' : 'bg-light';
  // const navbarVariant = currentUser ? 'dark' : 'light';
  return (
    <Navbar expand="lg" style={menuStyle} className={navbarClassName}>
      <Container>
        <Navbar.Brand href="/" className="align-items-center">
          <span style={{ fontWeight: 800, fontSize: '30px' }}>
            RIBows
            <Image src="/images/logo.png" width={30} height={30} style={{ marginBottom: 3 }} alt="Rainbow" />
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={ComponentIDs.basicNavbarNav} />
        <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
          <Nav className="me-auto justify-content-start">
            <Nav.Link
              id="search-nav"
              active={pathname === '/search'}
              href="/search"
              key="search"
            >
              Search
            </Nav.Link>
            {currentUser && role === 'ADMIN' && (
              <Nav.Link
                id="admin-search-nav"
                active={pathname === '/adminSearch'}
                href="/adminSearch"
                key="adminSearch"
              >
                Admin Search
              </Nav.Link>
            )}
            {currentUser && role === 'ADMIN' ? (
              <Nav.Link id="admin-add-nav" href="/addRIO" key="admin" active={pathname === '/addRIO'}>
                Add RIO
              </Nav.Link>
            ) : (
              ''
            )}
            {currentUser && role === 'ADMIN-CLUB' && (
              <Nav.Link
                id="admin-club-edit-nav"
                active={pathname === '/edit'}
                href="/edit"
                key="edit"
              >
                editRIO
              </Nav.Link>
            )}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser ? (
              <NavDropdown id={ComponentIDs.currentUserDropdown} title={currentUser}>
                <NavDropdown.Item id="editProfile" href="/editProfile">
                  <Container className="ps-0 d-flex align-items-center gap-1">
                    <Pen />
                    Edit Profile
                  </Container>

                </NavDropdown.Item>
                <NavDropdown.Item id={ComponentIDs.currentUserDropdownSignOut} href="/auth/signout">
                  <Container className="ps-0 d-flex align-items-center gap-1">
                    <BoxArrowRight />
                    Sign out
                  </Container>
                </NavDropdown.Item>
              </NavDropdown>
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
