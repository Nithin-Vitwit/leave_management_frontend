import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function TopNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("hr_token");

  const handleLogout = () => {
    localStorage.removeItem("hr_token");
    localStorage.removeItem("hr_expires");
    navigate("/");
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <strong>Leave Manager</strong>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/employee">Employee</Nav.Link>
            <Nav.Link as={Link} to="/hr">HR</Nav.Link>
          </Nav>
          <Nav>
            {token ? (
              <Button variant="outline-secondary" size="sm" onClick={handleLogout}>HR Logout</Button>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
