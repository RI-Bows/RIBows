/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Person, Pen, Bookmarks, InfoCircle, Search } from 'react-bootstrap-icons';
// eslint-disable-next-line import/extensions
import { ComponentIDs } from '@/utilities/ids';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const currentUser = session?.user?.email;
  // const userWithRole = session?.user as { email: string; randomKey: string };
  const role = (session?.user as any)?.role ?? null;
  const menuStyle = { marginBottom: '0px' };
  const navbarClassName = 'ribows-navbar';
  // const navbarVariant = currentUser ? 'dark' : 'light';
  return (
    <Navbar expand="lg" fixed="top" style={menuStyle} className={navbarClassName}>
      <Container>
        <Navbar.Brand
          href="/"
          className="ribows-brand-text"
        >
          <span className="ribows-brand-text">
            RIBows
            <Image src="/images/logo.png" width={30} height={30} style={{ marginBottom: 3 }} alt="Rainbow" />
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={ComponentIDs.basicNavbarNav} />
        <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
          <Nav className="me-auto justify-content-start">
            {!currentUser || role !== 'ADMIN' ? (
              <Nav.Link
                id="search-nav"
                active={pathname === '/search'}
                href="/search"
                key="search"
                className="ribows-nav-link d-flex align-items-center gap-2"
              >
                <Search />
                Search
              </Nav.Link>
            ) : (
              ''
            )}
            {currentUser && role === 'ADMIN' ? (
              <>
                <Nav.Link
                  id="search-nav"
                  active={pathname === '/search'}
                  href="/search"
                  key="search"
                  className="ribows-nav-link"
                >
                  Admin Search
                </Nav.Link>
                <Nav.Link
                  id="admin-add-nav"
                  href="/addRio"
                  key="admin"
                  active={pathname === '/addRio'}
                  className="ribows-nav-link"
                >
                  Add RIO
                </Nav.Link>
              </>
            ) : (
              ''
            )}
            {currentUser && role === 'CLUB' && (
              <Nav.Link
                id="admin-club-edit-nav"
                active={pathname === '/editRio'}
                href="/editRio"
                key="editRio"
                className="ribows-nav-link"
              >
                Edit RIO
              </Nav.Link>
            )}
          </Nav>
          <Nav className="justify-content-end">
            <Nav.Link
              id="about-nav"
              active={pathname === '/about'}
              href="/about"
              key="about"
              className="ribows-nav-link d-flex align-items-center gap-2"

            >
              <InfoCircle />
              About Us
            </Nav.Link>
            {currentUser ? (
              <Nav.Link
                id="bookmarks-nav"
                active={pathname === '/bookmarks'}
                href="/bookmarks"
                key="bookmarks"
                className="ribows-nav-link d-flex align-items-center gap-2"
              >
                <Bookmarks />
                Bookmarks
              </Nav.Link>
            ) : (
              ''
            )}
            {currentUser ? (
              <NavDropdown
                id={ComponentIDs.currentUserDropdown}
                title={
                  <span className="ribows-nav-link">{currentUser}</span>
                }
                className="ribows-nav-link"
              >
                <NavDropdown.Item id="editProfile" href="/editProfile">
                  <Container className="text-primary ps-0 d-flex align-items-center gap-2">
                    <Pen />
                    Edit Profile
                  </Container>

                </NavDropdown.Item>
                <NavDropdown.Item id={ComponentIDs.currentUserDropdownSignOut} href="/auth/signout">
                  <Container className="text-primary ps-0 d-flex align-items-center gap-2">
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
                className="ribows-nav-link"
              >
                <Container className="d-flex align-items-center gap-2">
                  <Person />
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
