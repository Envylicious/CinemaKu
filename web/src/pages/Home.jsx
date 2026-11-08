import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Film, Music, Tv } from "lucide-react";
import api from "../services/api";

function Home() {
    const [contents, setContents] = useState([]);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchContents = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/contents", {
                    params: {
                        search: search || undefined,
                        type: type || undefined
                    }
                });

                setContents(
                    response.data.contents || response.data
                );
            } catch (err) {
                setError("Gagal mengambil konten dari server.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchContents();
    }, [search, type]);

    return (
        <div className="home-container">
            <section className="home-hero">
                <h1>Carilah EntertainmentMu</h1>
                <p>
                    Explore movies, TV series, and music
                    all in one place.
                </p>

                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search movies, series, music..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </section>

            <section className="content-section">
                <h2>Explore Entertainment</h2>

                <div className="category-filters">
                    <button
                        className={type === "" ? "active" : ""}
                        onClick={() => setType("")}
                    >
                        All
                    </button>

                    <button
                        className={type === "movie" ? "active" : ""}
                        onClick={() => setType("movie")}
                    >
                        <Film size={16} /> Movies
                    </button>

                    <button
                        className={type === "series" ? "active" : ""}
                        onClick={() => setType("series")}
                    >
                        <Tv size={16} /> Series
                    </button>

                    <button
                        className={type === "music" ? "active" : ""}
                        onClick={() => setType("music")}
                    >
                        <Music size={16} /> Music
                    </button>
                </div>

                {loading && <p>Loading content...</p>}

                {error && <p className="error-message">{error}</p>}

                {!loading && !error && contents.length === 0 && (
                    <p>No content found.</p>
                )}

                <div className="content-grid">
                    {contents.map((item) => (
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

export default Home;