import { Link, useNavigate } from "react-router-dom";
import { Film, Home, Heart, LogIn, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            {/* Logo */}
            <Link to="/home" className="navbar-logo">
                <Film size={26} />
                <span>CinemaKu</span>
            </Link>

            {/* Navigasi */}
            <div className="navbar-links">
                <Link to="/home">
                    <Home size={18} />
                    Home
                </Link>

                {user && (
                    <Link to="/favorites">
                        <Heart size={18} />
                        Favorites
                    </Link>
                )}
            </div>

            {/* Menu pengguna */}
            <div className="navbar-actions">
                {!loading && (
                    user ? (
                        <>
                            <span className="navbar-username">
                                Hi, {user.name}
                            </span>

                            <button
                                className="navbar-logout"
                                onClick={handleLogout}
                            >
                                <LogOut size={17} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-login">
                                <LogIn size={17} />
                                Login
                            </Link>

                            <Link to="/register" className="navbar-register">
                                <UserPlus size={17} />
                                Register
                            </Link>
                        </>
                    )
                )}
            </div>
        </nav>
    );
}

export default Navbar;
