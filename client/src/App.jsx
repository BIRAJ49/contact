import { useEffect, useMemo, useState } from 'react';
import ContactForm from './components/ContactForm.jsx';
import ContactList from './components/ContactList.jsx';

const emptyContact = {
  name: '',
  email: '',
  phone: '',
};

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const body = await response.json();
      if (body?.message) {
        message = body.message;
      }
    } catch (error) {
      // ignore JSON parsing errors and fall back to default message
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = useMemo(() => Boolean(editing), [editing]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await request('/api/contacts');
        setContacts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError('');
    try {
      if (isEditing) {
        const updated = await request(`/api/contacts/${editing.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setContacts((prev) =>
          prev.map((contact) => (contact.id === updated.id ? updated : contact))
        );
      } else {
        const created = await request('/api/contacts', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setContacts((prev) => [...prev, created].sort(byName));
      }
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (contact) => {
    if (!window.confirm(`Delete contact ${contact.name}?`)) {
      return;
    }
    setError('');
    try {
      await request(`/api/contacts/${contact.id}`, { method: 'DELETE' });
      setContacts((prev) => prev.filter((item) => item.id !== contact.id));
      if (editing?.id === contact.id) {
        setEditing(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (contact) => {
    setEditing(contact);
  };

  return (
    <div className="container">
      <header>
        <h1>Contacts</h1>
        <p>Track your contacts by name, email, and phone number.</p>
      </header>
      <main>
        <section className="form-section">
          <h2>{isEditing ? 'Edit Contact' : 'Add Contact'}</h2>
          <ContactForm
            key={editing?.id ?? 'new'}
            initialValues={editing ?? emptyContact}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
            isEditing={isEditing}
            submitting={submitting}
          />
        </section>
        <section className="list-section">
          <h2>Saved Contacts</h2>
          {error && <div className="error">{error}</div>}
          {loading ? (
            <div className="empty">Loading contacts…</div>
          ) : contacts.length ? (
            <ContactList contacts={contacts} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <div className="empty">No contacts yet. Add your first one above.</div>
          )}
        </section>
      </main>
    </div>
  );
}

function byName(a, b) {
  return a.name.localeCompare(b.name);
}

export default App;
