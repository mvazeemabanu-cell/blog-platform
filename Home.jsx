import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await API.get('/posts');
                setPosts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading posts...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">All Blog Posts</h1>

            {posts.length === 0 && <p className="text-gray-500">No posts yet. Be the first to write one!</p>}

            <div className="space-y-4">
                {posts.map((post) => (
                    <Link
                        to={`/post/${post.id}`}
                        key={post.id}
                        className="block bg-white p-5 rounded-lg shadow hover:shadow-md transition"
                    >
                        <h2 className="text-xl font-semibold text-blue-700">{post.title}</h2>
                        <p className="text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                        <p className="text-sm text-gray-400 mt-2">
                            by {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;