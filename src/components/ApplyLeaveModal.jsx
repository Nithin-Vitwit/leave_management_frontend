import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import api from "../api/axiosClient";
import { toISODateLocal } from "../utils/date";

export default function ApplyLeaveModal({ show, onHide, empId, onApplied }) {
  const [reason, setReason] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError(null);
    if (!empId) return setError("Employee ID missing. Load profile first.");
    if (!reason || !from || !to) return setError("Please fill all fields.");
    setSubmitting(true);

    try {
      const payload = {
        reason,
        from_date: toISODateLocal(from),
        to_date: toISODateLocal(to),
      };
      // backend expects Leave struct with FromDate/ToDate time.Time — use ISO timestamps
      await api.post(`/employee/${empId}/apply-leave`, payload);
      onApplied && onApplied(payload);
      setReason("");
      setFrom("");
      setTo("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Failed to apply leave");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton><Modal.Title>Apply for Leave</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Reason</Form.Label>
            <Form.Control value={reason} onChange={(e) => setReason(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>From</Form.Label>
            <Form.Control type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>To</Form.Label>
            <Form.Control type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={submitting}>Cancel</Button>
        <Button onClick={submit} disabled={submitting}>
          {submitting ? "Applying..." : "Apply"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
