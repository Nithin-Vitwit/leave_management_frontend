import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function HrLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e?.preventDefault();
    setMsg(null);
    try {
      const res = await api.post("/hr/login", { id, password });
      const { token, expires } = res.data;
      localStorage.setItem("hr_token", token);
      if (expires) localStorage.setItem("hr_expires", expires);
      setMsg({ type: "success", text: "Logged in — redirecting..." });
      setTimeout(() => navigate("/hr/dashboard"), 600);
    } catch (err) {
      console.error(err);
      setMsg({ type: "danger", text: err.response?.data || "Login failed" });
    }
  };

  return (
    <div className="container-app">
      <Card className="card-professional p-4">
        <h4>HR Login</h4>
        <p className="text-muted">Enter HR credentials to access pending leaves.</p>
        {msg && <Alert variant={msg.type}>{msg.text}</Alert>}
        <Form onSubmit={submit}>
          <Form.Group className="mb-2">
            <Form.Label>HR ID</Form.Label>
            <Form.Control value={id} onChange={(e) => setId(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button type="submit">Login</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
