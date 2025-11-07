import React, { useEffect, useState } from "react";
import { Card, Table, Button, Alert } from "react-bootstrap";
import api from "../api/axiosClient";
import { formatShort } from "../utils/date";
import { useNavigate } from "react-router-dom";

export default function HrDashboard() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hr_token");
    if (!token) {
      navigate("/hr");
      return;
    }
    fetchPending();
    // eslint-disable-next-line
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hr/pending-leaves");
      setPending(res.data || []);
    } catch (err) {
      console.error(err);
      setMsg({ type: "danger", text: "Failed to load pending leaves or unauthorized." });
      if (err.response?.status === 401) {
        localStorage.removeItem("hr_token");
        navigate("/hr");
      }
    } finally {
      setLoading(false);
    }
  };

  const act = async (idx, action) => {
    setMsg(null);
    try {
      await api.post(`/hr/leave/${idx}/${action}`);
      setMsg({ type: "success", text: `Leave ${action}ed successfully.` });
      fetchPending();
    } catch (err) {
      console.error(err);
      setMsg({ type: "danger", text: err.response?.data || "Action failed." });
    }
  };

  return (
    <div className="container-app">
      <Card className="card-professional p-4">
        <h4>HR — Pending Leaves</h4>
        <p className="text-muted">Approve or decline pending requests below.</p>

        {msg && <Alert variant={msg.type}>{msg.text}</Alert>}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <Table hover responsive>
              <thead>
                <tr>
                  <th># (index)</th>
                  <th>Employee</th>
                  <th>Reason</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.length === 0 && (
                  <tr><td colSpan="6" className="text-center">No pending leaves</td></tr>
                )}
                {pending.map((l, i) => (
                  <tr key={i}>
                    <td>{i}</td>
                    <td>{l.name} ({l.emp_id || l.empID || l.EmpID})</td>
                    <td>{l.reason}</td>
                    <td>{formatShort(l.from_date || l.fromDate || l.FromDate)}</td>
                    <td>{formatShort(l.to_date || l.toDate || l.ToDate)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button size="sm" onClick={() => act(i, "grant")}>Grant</Button>
                        <Button size="sm" variant="danger" onClick={() => act(i, "decline")}>Decline</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Card>
    </div>
  );
}
