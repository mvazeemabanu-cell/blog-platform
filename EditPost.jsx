import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

const EditPost = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await API.get(`/posts/${id}`);
                setFormData({ title: res.data.title, content: res.data.content });
            } catch (err) {
                console.error(err);
            }
        };
        fetchPost();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/posts/${id}`, formData);
            navigate(`/post/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update post');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <textarea
                    name="content"
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
                    Update Post
                </button>
            </form>
        </div>
    );
};

export default EditPost;