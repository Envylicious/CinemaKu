import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Star,
    Calendar,
    User,
    Tag,
    Heart
} from "lucide-react";

import api from "../services/api";

function Detail() {
    const { id } = useParams();

    // State untuk detail konten
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // State untuk Favorites
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    // State untuk Rating dan Review
    const [reviews, setReviews] = useState([]);
    const [userRating, setUserRating] = useState(10);
    const [comment, setComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState("");

    // Mengambil detail konten dan memeriksa Favorites
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError("");
                setIsFavorite(false);
                setReviews([]);

                // Mengambil detail konten
                const response = await api.get(`/contents/${id}`);

                const contentData =
                    response.data.content || response.data;

                setContent(contentData);
                // Mengambil review untuk konten ini
                const reviewResponse = await api.get(`/reviews/${id}`);
                setReviews(reviewResponse.data.reviews || []);

                // Memeriksa status Favorites jika pengguna sudah login
                const token = localStorage.getItem("token");

                if (token) {
                    try {
                        const favoriteResponse = await api.get(
                            "/favorites",
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        const favoriteList =
                            favoriteResponse.data.favorites ||
                            favoriteResponse.data;

                        setIsFavorite(
                            favoriteList.some(
                                (item) => item._id === id
                            )
                        );
                    } catch (favoriteError) {
                        console.error(
                            "Failed to check favorites:",
                            favoriteError
                        );
                    }
                }
            } catch (err) {
                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Gagal mengambil detail konten."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    // Menambahkan atau menghapus Favorites
    const handleFavorite = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Silakan login terlebih dahulu.");
            return;
        }

        try {
            setFavoriteLoading(true);

            if (isFavorite) {
                // Menghapus dari Favorites
                await api.delete(`/favorites/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setIsFavorite(false);
                alert("Removed from favorites.");
            } else {
                // Menambahkan ke Favorites
                await api.post(
                    `/favorites/${id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setIsFavorite(true);
                alert("Added to favorites!");
            }
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to update favorites."
            );
        } finally {
            setFavoriteLoading(false);
        }
    };

        
        const handleSubmitReview = async (e) => {
            e.preventDefault();

            const token = localStorage.getItem("token");

            if (!token) {
                alert("Silakan login terlebih dahulu.");
                return;
            }

            try {
                setReviewLoading(true);
                setReviewError("");

                // Mengirim review ke backend
                await api.post(
                    `/reviews/${id}`,
                    {
                        rating: Number(userRating),
                        comment
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Review berhasil dikirim!");

                setComment("");

                // Mengambil ulang daftar review
                let reviewData = null;

                try {
                    const reviewResponse = await api.get(`/reviews/${id}`);

                    reviewData = reviewResponse.data;

                    setReviews(reviewData.reviews || []);
                } catch (reviewError) {
                    console.error("Failed to fetch reviews:", reviewError);
                }

                // Memperbarui rating rata-rata
                if (reviewData) {
                    setContent((previous) => ({
                        ...previous,
                        rating: reviewData.rating,
                        ratingCount: reviewData.ratingCount
                    }));
                }

            } catch (err) {
                console.error(err);

                setReviewError(
                    err.response?.data?.message ||
                    "Gagal mengirim review."
                );
            } finally {
                setReviewLoading(false);
            }
        };


    // Tampilan ketika data sedang dimuat
    if (loading) {
        return (
            <p className="detail-message">
                Loading content...
            </p>
        );
    }

    // Tampilan ketika konten tidak ditemukan
    if (error || !content) {
        return (
            <div className="detail-message">
                <p>{error || "Content not found."}</p>
                <Link to="/home">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="detail-container">

            {/* Tombol kembali */}
            <Link to="/home" className="back-link">
                <ArrowLeft size={18} />
                Back to Home
            </Link>

            <div className="detail-content">

                {/* Poster konten */}
                <div className="detail-poster">
                    {content.poster ? (
                        <img
                            src={content.poster}
                            alt={content.title}
                        />
                    ) : (
                        <div className="poster-placeholder">
                            {content.title}
                        </div>
                    )}
                </div>

                {/* Informasi konten */}
                <div className="detail-info">

                    <span className="detail-type">
                        {content.type}
                    </span>

                    <h1>{content.title}</h1>

                    {/* Rating */}
                    <div className="detail-rating">
                        <Star size={18} fill="currentColor" />

                        <strong>
                            {content.rating}/10
                        </strong>

                        <span>
                            ({content.ratingCount || 0} reviews)
                        </span>
                    </div>

                    {/* Deskripsi */}
                    <p className="detail-description">
                        {content.description}
                    </p>

                    {/* Informasi tambahan */}
                    <div className="detail-metadata">

                        <p>
                            <Calendar size={17} />
                            Release Year: {content.releaseYear}
                        </p>

                        <p>
                            <User size={17} />
                            Creator: {content.creator}
                        </p>

                        <p>
                            <Tag size={17} />
                            Genre:{" "}
                            {content.genre?.length
                                ? content.genre.join(", ")
                                : "Not specified"}
                        </p>

                    </div>

                    {/* Tombol Favorites */}
                    <button
                        className="favorite-button"
                        onClick={handleFavorite}
                        disabled={favoriteLoading}
                    >
                        <Heart
                            size={18}
                            fill={
                                isFavorite
                                    ? "currentColor"
                                    : "none"
                            }
                        />

                        {favoriteLoading
                            ? "Processing..."
                            : isFavorite
                                ? "Remove from Favorites"
                                : "Add to Favorites"}
                    </button>

                    {/* Tombol Trailer */}
                    {content.trailerUrl && (
                        <a
                            href={content.trailerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="trailer-button"
                        >
                            Watch Trailer
                        </a>
                    )}

                </div>
            </div>
            
            {/* Form Rating dan Review */}
            <section className="review-section">
                <h2>Rate and Review</h2>
                <p>Share your thoughts about this content.</p>

                <form onSubmit={handleSubmitReview} className="review-form">
                    <label htmlFor="userRating">Your Rating</label>

                    <select
                        id="userRating"
                        value={userRating}
                        onChange={(e) => setUserRating(Number(e.target.value))}
                    >
                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((rating) => (
                            <option key={rating} value={rating}>
                                {rating} / 10
                            </option>
                        ))}
                    </select>

                    <label htmlFor="comment">Your Review</label>

                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your thoughts about this content..."
                        maxLength={1000}
                        rows={4}
                    />

                    <div className="review-form-footer">
                        <span>{comment.length}/1000 characters</span>

                        <button type="submit" disabled={reviewLoading}>
                            {reviewLoading ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>

                    {reviewError && (
                        <p className="error-message">{reviewError}</p>
                    )}
                </form>
            </section>

            {/* Daftar Review Pengguna */}
            <section className="reviews-list-section">
                <h2>User Reviews ({reviews.length})</h2>

                {reviews.length === 0 ? (
                    <p className="no-reviews">
                        No reviews yet. Be the first to review this content!
                    </p>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div className="review-card" key={review._id}>
                                <div className="review-card-header">
                                    <strong>
                                        {review.user?.name || "CinemaKu User"}
                                    </strong>

                                    <span>
                                        <Star size={15} fill="currentColor" />
                                        {review.rating}/10
                                    </span>
                                </div>

                                <p>
                                    {review.comment || "No written comment."}
                                </p>

                                <small>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}

export default Detail;
