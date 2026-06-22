import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
            <Link to="/" className="text-xl font-bold">BlogPlatform</Link>

            <div className="flex gap-4 items-center">
                {user ? (
                    <>
                        <Link to="/create" className="hover:underline">New Post</Link>
                        <span className="text-sm">Hi, {user.name}</span>
                        <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:underline">Login</Link>
                        <Link to="/register" className="hover:underline">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;