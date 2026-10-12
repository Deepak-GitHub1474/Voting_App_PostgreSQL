import { useState } from "react";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";

import AuthFrame from "../components/layout/AuthFrame.jsx";
import { Alert, Button, Input } from "../components/ui/index.jsx";
import { validateRegistration } from "../lib/data.js";

const FIELDS = ["name", "email", "password", "phone"];

export default function Register() {
  const result = useActionData();
  const submitting = useNavigation().state === "submitting";
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [touched, setTouched] = useState({});

  const errors = validateRegistration(form);
  const serverErrors = result?.fieldErrors || {};
  const fieldError = (field) => (touched[field] ? errors[field] : undefined) || serverErrors[field];
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const blur = (field) => () => setTouched((current) => ({ ...current, [field]: true }));

  const touchAll = (event) => {
    setTouched(Object.fromEntries(FIELDS.map((field) => [field, true])));
    if (Object.keys(errors).length) event.preventDefault();
  };

  const field = (name) => ({ name, value: form[name], onChange: update(name), onBlur: blur(name), error: fieldError(name), readOnly: submitting });

  return (
    <AuthFrame
      title="Register"
      subtitle="Register once to receive your ballot for every round."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Login
          </Link>
        </>
      }
    >
      <Form method="post" replace onSubmit={touchAll} className="flex flex-col gap-5" noValidate>
        {result?.error && !submitting && <Alert>{result.error}</Alert>}
        <Input label="Full name" autoComplete="name" placeholder="Asha Verma" {...field("name")} />
        <Input label="Email" type="email" autoComplete="email" placeholder="you@example.com" {...field("email")} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Password" type="password" autoComplete="new-password" placeholder="At least 6 characters" {...field("password")} />
          <Input label="Phone" type="tel" autoComplete="tel" placeholder="98765 43210" {...field("phone")} />
        </div>
        <Button type="submit" block loading={submitting}>
          {submitting ? "Registering…" : "Register"}
        </Button>
      </Form>
    </AuthFrame>
  );
}
