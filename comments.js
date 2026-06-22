const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// ============ ADD A COMMENT ============
router.post('/:postId', verifyToken, (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;
    const { comment_text } = req.body;

    if (!comment_text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    // Check post exists first
    db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error', error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        db.query(
            'INSERT INTO comments (post_id, user_id, comment_text) VALUES (?, ?, ?)',
            [postId, userId, comment_text],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Server error', error: err.message });

                res.status(201).json({ message: 'Comment added successfully!', commentId: result.insertId });
            }
        );
    });
});

// ============ GET ALL COMMENTS FOR A POST ============
router.get('/:postId', (req, res) => {
    const postId = req.params.postId;

    const query = `
        SELECT comments.id, comments.comment_text, comments.created_at,
               users.name AS commenter_name
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = ?
        ORDER BY comments.created_at ASC
    `;

    db.query(query, [postId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error', error: err.message });

        res.status(200).json(results);
    });
});

// ============ DELETE A COMMENT ============
router.delete('/:commentId', verifyToken, (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    db.query('SELECT * FROM comments WHERE id = ?', [commentId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error', error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (results[0].user_id !== userId) {
            return res.status(403).json({ message: 'You can only delete your own comments' });
        }

        db.query('DELETE FROM comments WHERE id = ?', [commentId], (err) => {
            if (err) return res.status(500).json({ message: 'Server error', error: err.message });

            res.status(200).json({ message: 'Comment deleted successfully!' });
        });
    });
});

module.exports = router;