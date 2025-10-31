import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, name, email, phone FROM contacts ORDER BY name ASC'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'name, email, and phone are required' });
  }
  try {
    const { rows } = await query(
      'INSERT INTO contacts (name, email, phone) VALUES ($1, $2, $3) RETURNING id, name, email, phone',
      [name.trim(), email.trim(), phone.trim()]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'A contact with that email already exists' });
    }
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'name, email, and phone are required' });
  }
  try {
    const { rows } = await query(
      'UPDATE contacts SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id, name, email, phone',
      [name.trim(), email.trim(), phone.trim(), id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'A contact with that email already exists' });
    }
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rowCount } = await query('DELETE FROM contacts WHERE id = $1', [id]);
    if (!rowCount) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
