import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const postRes = await API.get(`/posts/${id}`);
            setPost(postRes.data);
            const commentsRes = await API.get(`/comments/${id}`);
            setComments(commentsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDeletePost = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await API.delete(`/posts/${id}`);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete post');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            await API.post(`/comments/${id}`, { comment_text: commentText });
            setCommentText('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await API.delete(`/comments/${commentId}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (!post) return <p className="text-center mt-10">Loading...</p>;

    const isAuthor = user && user.id === post.user_id;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                <p className="text-sm text-gray-400 mb-4">
                    by {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-700 whitespace-pre-line">{post.content}</p>

                {isAuthor && (
                    <div className="flex gap-3 mt-4">
                        <Link
                            to={`/edit/${post.id}`}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDeletePost}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                {user ? (
                    <form onSubmit={handleAddComment} className="mb-6 flex gap-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Post
                        </button>
                    </form>
                ) : (
                    <p className="text-gray-500 mb-6">
                        <Link to="/login" className="text-blue-600">Login</Link> to add a comment.
                    </p>
                )}

                <div className="space-y-3">
                    {comments.map((c) => (
                        <div key={c.id} className="border-b pb-3 flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-sm">{c.commenter_name}</p>
                                <p className="text-gray-700">{c.comment_text}</p>
                            </div>
                            {user && user.name === c.commenter_name && (
                                <button
                                    onClick={() => handleDeleteComment(c.id)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;