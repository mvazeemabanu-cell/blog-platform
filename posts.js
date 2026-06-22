const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// ============ CREATE A POST ============
router.post('/create', verifyToken, (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    db.query(
        'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
        [userId, title, content],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error', error: err.message });
            res.status(201).json({ message: 'Post created successfully!', postId: result.insertId });
        }
    );
});

// ============ GET ALL POSTS ============
router.get('/', (req, res) => {
    const query = `
        SELECT posts.id, posts.title, posts.content, posts.created_at, 
               users.name AS author_name
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error', error: err.message });
        res.status(200).json(results);
    });
});

// ============ GET SINGLE POST ============
router.get('/:id', (req, res) => {
    const postId = req.params.id;

    const query = `
        SELECT posts.id, posts.title, posts.content, posts.created_at, posts.user_id,
               users.name AS author_name
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
    `;

    db.query(query, [postId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error', error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(results[0]);
    });
});

// ============ UPDATE A POST ============
router.put('/:id', verifyToken, (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
    const userId = req.user.id;

    db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error', error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (results[0].user_id !== userId) {
            return res.status(403).json({ message: 'You can only edit your own posts' });
        }

        db.query(
            'UPDATE posts SET title = ?, content = ? WHERE id = ?',
            [title, content, postId],
            (err) => {
                if (err) return res.status(500).json({ message: 'Server error', error: err.message });
                res.status(200).json({ message: 'Post updated successfully!' });
            }
        );
    });
});

// ============ DELETE A POST ============
router.delete('/:id', verifyToken, (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error', error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (results[0].user_id !== userId) {
            return res.status(403).json({ message: 'You can only delete your own posts' });
        }

        db.query('DELETE FROM posts WHERE id = ?', [postId], (err) => {
            if (err) return res.status(500).json({ message: 'Server error', error: err.message });
            res.status(200).json({ message: 'Post deleted successfully!' });
        });
    });
});

module.exports = router;