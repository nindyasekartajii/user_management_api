import { cloudinary } from '../config/cloudinary.js';
import streamifier from 'streamifier';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

// ✅ GET /api/users
export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, email, role, avatar_url FROM users'
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('getUsers error:', err);
    res.status(500).json({
      message: 'Failed to fetch users',
      error: err.message || 'Unknown error'
    });
  }
};

// ✅ POST /api/users/avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'No file uploaded or file is invalid' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'avatars' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const { id } = req.user;
    await pool.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2',
      [result.secure_url, id]
    );

    res.status(200).json({
      message: 'Avatar uploaded successfully',
      url: result.secure_url
    });
  } catch (err) {
    console.error('UploadAvatar error:', err);
    res.status(500).json({
      message: 'Upload failed',
      error: err.message || 'Unknown error'
    });
  }
};

// ✅ PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const tokenId = req.user.id;

    if (userId !== tokenId) {
      return res.status(403).json({ message: 'Kamu hanya bisa edit profilmu sendiri' });
    }

    const { username, email, password } = req.body;

    // 🔍 Validasi email dan password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email tidak valid' });
    }
    if (password && password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    let query, values;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      query = `
        UPDATE users SET username = $1, email = $2, password = $3, updated_at = NOW()
        WHERE id = $4 RETURNING id, username, email, role, avatar_url, updated_at
      `;
      values = [username, email, hashed, userId];
    } else {
      query = `
        UPDATE users SET username = $1, email = $2, updated_at = NOW()
        WHERE id = $3 RETURNING id, username, email, role, avatar_url, updated_at
      `;
      values = [username, email, userId];
    }

    const { rows } = await pool.query(query, values);
    res.status(200).json({ message: 'Profil berhasil diupdate', user: rows[0] });

  } catch (err) {
    console.error('updateUser error:', err);
    res.status(500).json({ message: 'Gagal update profil', error: err.message });
  }
};