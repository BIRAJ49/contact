import { useState } from 'react';

const initialTouched = {
  name: false,
  email: false,
  phone: false,
};

function ContactForm({ initialValues, onSubmit, onCancel, isEditing, submitting }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState(initialTouched);

  const errors = validate(values);
  const hasErrors = Object.values(errors).some(Boolean);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({
      name: true,
      email: true,
      phone: true,
    });

    if (hasErrors) {
      return;
    }
    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    onCancel?.();
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <label>
        <span>Name</span>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Ada Lovelace"
          disabled={submitting}
          required
        />
        {touched.name && errors.name && <small className="input-error">{errors.name}</small>}
      </label>

      <label>
        <span>Email</span>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="ada@example.com"
          disabled={submitting}
          required
        />
        {touched.email && errors.email && <small className="input-error">{errors.email}</small>}
      </label>

      <label>
        <span>Phone</span>
        <input
          type="tel"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="+1 (555) 123-4567"
          disabled={submitting}
          required
        />
        {touched.phone && errors.phone && <small className="input-error">{errors.phone}</small>}
      </label>

      <div className="form-actions">
        {isEditing && (
          <button type="button" className="secondary" onClick={handleCancel} disabled={submitting}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting || hasErrors}>
          {submitting ? 'Saving…' : isEditing ? 'Update Contact' : 'Add Contact'}
        </button>
      </div>
    </form>
  );
}

function validate(values) {
  const errors = {
    name: '',
    email: '',
    phone: '',
  };

  if (!values.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone is required';
  }

  return errors;
}

export default ContactForm;
