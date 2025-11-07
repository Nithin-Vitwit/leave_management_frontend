import React, { useState } from "react";
import { Card, Row, Col, Form, Button, Table, Alert } from "react-bootstrap";
import api from "../api/axiosClient";
import ApplyLeaveModal from "./ApplyLeaveModal";
import { formatShort } from "../utils/date";

export default function EmployeePage() {
  const [empId, setEmpId] = useState("");
  const [profile, setProfile] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchProfile = async () => {
    if (!empId) return setMessage({ type: "danger", text: "Enter employee ID" });
    setLoading(true);
    try {
      const res = await api.get(`/employee/${empId}`);
      setProfile(res.data);
      const leavesRes = await api.get(`/employee/${empId}/leaves`);
      setLeaves(leavesRes.data || []);
      setMessage(null);
    } catch (err) {
      console.error(err);
      setProfile(null);
      setLeaves([]);
      setMessage({ type: "danger", text: err.response?.data || "Failed to fetch" });
    } finally {
      setLoading(false);
    }
  };

  const onApplied = (newLeave) => {
    // fetch list again
    fetchProfile();
    setShowApply(false);
    setMessage({ type: "success", text: "Leave applied successfully" });
  };

  return (
    <div className="container-app">
      <Card className="card-professional p-4">
        <Row>
          <Col md={8}>
            <h4>Employee Portal</h4>
            <p className="text-muted">Enter your employee ID to view profile and leaves.</p>
          </Col>
          <Col md={4}>
            <Form className="d-flex">
              <Form.Control
                placeholder="Employee ID"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
              />
              <Button className="ms-2" onClick={fetchProfile} disabled={loading}>
                {loading ? "Loading..." : "Load"}
              </Button>
            </Form>
          </Col>
        </Row>

        <hr />

        {message && <Alert variant={message.type}>{message.text}</Alert>}

        {profile ? (
          <>
            <Row className="mb-3">
              <Col md={4}>
                <Card className="p-3">
                  <h5>{profile.name}</h5>
                  <div className="text-muted">ID: {profile.id}</div>
                </Card>
              </Col>
              <Col md={8} className="d-flex align-items-center">
                <div>
                  <Button onClick={() => setShowApply(true)}>Apply for Leave</Button>
                </div>
              </Col>
            </Row>

            <h6 className="mt-3">Your Leaves</h6>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Reason</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 && (
                  <tr><td colSpan="5" className="text-center">No leaves found</td></tr>
                )}
                {leaves.map((l, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{l.reason}</td>
                    <td>{formatShort(l.from_date || l.fromDate || l.FromDate)}</td>
                    <td>{formatShort(l.to_date || l.toDate || l.ToDate)}</td>
                    <td>{l.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : (
          <div className="text-muted">No employee loaded.</div>
        )}
      </Card>

      <ApplyLeaveModal
        show={showApply}
        onHide={() => setShowApply(false)}
        empId={empId}
        onApplied={onApplied}
      />
    </div>
  );
}
