import { useState } from "react";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";

import AuthFrame from "../components/layout/AuthFrame.jsx";
import { Alert, Button, Input } from "../components/ui/index.jsx";

export default function Login() {
  const result = useActionData();
  const submitting = useNavigation().state === "submitting";
  const [form, setForm] = useState({ email: "", password: "" });

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  return (
    <AuthFrame
      title="Login"
      subtitle="Use the email you registered with to access your ballot."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Register
          </Link>
        </>
      }
    >
      <Form method="post" replace className="flex flex-col gap-5" noValidate>
        {result?.error && !submitting && <Alert>{result.error}</Alert>}
        <Input label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update("email")} readOnly={submitting} />
        <Input label="Password" name="password" type="password" autoComplete="current-password" placeholder="Your password" value={form.password} onChange={update("password")} readOnly={submitting} />
        <Button type="submit" block loading={submitting} disabled={!form.email.trim() || !form.password}>
          {submitting ? "Logging in…" : "Login"}
        </Button>
      </Form>
    </AuthFrame>
  );
}
