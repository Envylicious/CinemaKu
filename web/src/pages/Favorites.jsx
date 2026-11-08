import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import api from "../services/api";

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("/favorites", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setFavorites(
                    response.data.favorites || response.data
                );
            } catch (err) {
                console.error(err);
                setError("Gagal mengambil daftar favorites.");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="home-container">
            <section className="content-section">
                <h1>
                    <Heart size={26} fill="currentColor" />
                    {" "}My Favorites
                </h1>

                <p>All your favorite entertainment in one place.</p>

                {loading && <p>Loading favorites...</p>}

                {error && <p className="error-message">{error}</p>}

                {!loading && !error && favorites.length === 0 && (
                    <p>You haven't added any favorites yet.</p>
                )}

                <div className="content-grid">
                    {favorites.map((item) => (
                        <Link
                            to={`/detail/${item._id}`}
                            className="content-card"
                            key={item._id}
                        >
                            <div className="content-poster">
                                {item.poster ? (
                                    <img
                                        src={item.poster}
                                        alt={item.title}
                                    />
                                ) : (
                                    <div className="poster-placeholder">
                                        {item.title}
                                    </div>
                                )}
                            </div>

                            <div className="content-info">
                                <h3>{item.title}</h3>
                                <p>
                                    {item.type} • {item.releaseYear}
                                </p>
                                <span>★ {item.rating}/10</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Favorites;
