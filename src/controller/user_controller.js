import pool from '../databaseModel/database.js'; 

export const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createUser = async (req, res) => {
    const { name, email, phone, gender, address } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, phone, gender, address) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, gender, address]
        );
        res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, gender, address } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE users SET name = ?, email = ?, phone = ?, gender = ?, address = ? WHERE id = ?',
            [name, email, phone, gender, address, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
