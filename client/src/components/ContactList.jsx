function ContactList({ contacts, onEdit, onDelete }) {
  return (
    <ul className="contact-list">
      {contacts.map((contact) => (
        <li key={contact.id} className="contact-card">
          <div className="contact-primary">
            <strong>{contact.name}</strong>
            <span>{contact.email}</span>
            <span>{contact.phone}</span>
          </div>
          <div className="contact-actions">
            <button type="button" onClick={() => onEdit(contact)}>
              Edit
            </button>
            <button type="button" className="danger" onClick={() => onDelete(contact)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ContactList;
