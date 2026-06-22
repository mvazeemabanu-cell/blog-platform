import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CreatePost = () => {
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/posts/create', formData);
            navigate(`/post/${res.data.postId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Write a New Post</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <input
                    type="text"
                    name="title"
                    placeholder="Post Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <textarea
                    name="content"
                    placeholder="Write your post here..."
                    value={formData.content}
                    onChange={handleChange}
                    rows="10"
                    className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                    Publish Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;