import { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    StyleSheet
} from "react-native";

import { ArrowLeft, Star, Calendar, User } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function DetailScreen({ route, navigation }) {
    const { contentId } = route.params;
    const { token } = useAuth();

    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [reviewSuccess, setReviewSuccess] = useState("");

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const [detailResponse, reviewResponse] = await Promise.all([
                    api.get(`/contents/${contentId}`),
                    api.get(`/reviews/${contentId}`)
                ]);

                const loadedContent =
                    detailResponse.data.content || detailResponse.data;

                setContent({
                    ...loadedContent,
                    rating: reviewResponse.data.rating ?? loadedContent.rating,
                    ratingCount:
                        reviewResponse.data.ratingCount ?? loadedContent.ratingCount
                });

                setReviews(reviewResponse.data.reviews || []);
            } catch (err) {
                console.error("Detail error:", err.message);
                setError(
                    err.response?.data?.message ||
                    "Gagal mengambil detail konten."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [contentId]);

    // Check apakah konten sudah menjadi favorite
    useEffect(() => {
        const checkFavorite = async () => {
            if (!token) return;

            try {
                const response = await api.get("/favorites", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const favorites =
                    response.data.favorites || response.data;

                setIsFavorite(
                    favorites.some((item) => item._id === contentId)
                );
            } catch (err) {
                console.error(
                    "Favorite check error:",
                    err.response?.data || err.message
                );
            }
        };

        checkFavorite();
    }, [contentId, token]);

    // Add atau remove favorite
    const toggleFavorite = async () => {
        if (!token || favoriteLoading) return;

        try {
            setFavoriteLoading(true);

            if (isFavorite) {
                await api.delete(`/favorites/${contentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setIsFavorite(false);
            } else {
                await api.post(
                    `/favorites/${contentId}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setIsFavorite(true);
            }
        } catch (err) {
            console.error(
                "Toggle favorite error:",
                err.response?.data || err.message
            );
        } finally {
            setFavoriteLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/reviews/${contentId}`);

            setReviews(response.data.reviews || []);

            setContent((previous) => ({
                ...previous,
                rating: response.data.rating ?? previous.rating,
                ratingCount: response.data.ratingCount ?? previous.ratingCount
            }));
        } catch (err) {
            console.error(
                "Fetch reviews error:",
                err.response?.data || err.message
            );
        }
    };

    const submitReview = async () => {
        setReviewError("");
        setReviewSuccess("");

        if (!token) {
            setReviewError("Silakan login terlebih dahulu.");
            return;
        }

        if (selectedRating < 1 || selectedRating > 10) {
            setReviewError("Pilih rating antara 1 sampai 10.");
            return;
        }

        try {
            setReviewLoading(true);

            await api.post(
                `/reviews/${contentId}`,
                {
                    rating: selectedRating,
                    comment: comment.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setComment("");
            setSelectedRating(0);

            await fetchReviews();

            setReviewSuccess("Review berhasil dikirim!");
        } catch (err) {
            setReviewError(
                err.response?.data?.message ||
                "Gagal mengirim review."
            );
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#a78bfa" />
                <Text style={styles.loadingText}>
                    Loading content...
                </Text>
            </View>
        );
    }

    if (error || !content) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>
                    {error || "Konten tidak ditemukan."}
                </Text>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Kembali</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity
                style={styles.backLink}
                onPress={() => navigation.goBack()}
            >
                <ArrowLeft color="#ffffff" size={20} />
                <Text style={styles.backText}>Kembali</Text>
            </TouchableOpacity>

            {content.poster ? (
                <Image
                    source={{ uri: content.poster }}
                    style={styles.poster}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.posterPlaceholder}>
                    <Text style={styles.placeholderText}>
                        No Poster
                    </Text>
                </View>
            )}

            <View style={styles.content}>
                <Text style={styles.type}>
                    {content.type?.toUpperCase()}
                </Text>

                <Text style={styles.title}>
                    {content.title}
                </Text>

                <View style={styles.ratingContainer}>
                    <Star color="#facc15" fill="#facc15" size={18} />

                    <Text style={styles.rating}>
                        {Number(content.rating || 0).toFixed(1)} / 10
                    </Text>

                    <Text style={styles.ratingCount}>
                        ({content.ratingCount || 0} reviews)
                    </Text>
                </View>

                {/* Favorite Button */}
                <TouchableOpacity
                    style={[
                        styles.favoriteButton,
                        isFavorite && styles.favoriteActive
                    ]}
                    onPress={toggleFavorite}
                    disabled={favoriteLoading || !token}
                >
                    {favoriteLoading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.favoriteText}>
                            {isFavorite
                                ? "♥ Remove from Favorites"
                                : "♡ Add to Favorites"}
                        </Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>
                    Synopsis
                </Text>

                <Text style={styles.description}>
                    {content.description || "Belum ada deskripsi."}
                </Text>

                <View style={styles.metadata}>
                    <View style={styles.metadataItem}>
                        <Calendar color="#a78bfa" size={18} />
                        <Text style={styles.metadataText}>
                            {content.releaseYear || "Unknown"}
                        </Text>
                    </View>

                    <View style={styles.metadataItem}>
                        <User color="#a78bfa" size={18} />
                        <Text style={styles.metadataText}>
                            {content.creator || "Unknown"}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>
                    Genres
                </Text>

                <View style={styles.genreContainer}>
                    {(content.genre || []).map((genre, index) => (
                        <View key={index} style={styles.genreBadge}>
                            <Text style={styles.genreText}>
                                {genre}
                            </Text>
                        </View>
                    ))}
                </View>
                
                <Text style={styles.sectionTitle}>
                    Write a Review
                </Text>

                <Text style={styles.reviewLabel}>
                    Select your rating (1–10)
                </Text>

                <View style={styles.ratingPicker}>
                    {Array.from({ length: 10 }, (_, index) => {
                        const ratingValue = index + 1;

                        return (
                            <TouchableOpacity
                                key={ratingValue}
                                style={[
                                    styles.ratingOption,
                                    selectedRating === ratingValue &&
                                        styles.ratingSelected
                                ]}
                                onPress={() => setSelectedRating(ratingValue)}
                            >
                                <Text
                                    style={[
                                        styles.ratingOptionText,
                                        selectedRating === ratingValue &&
                                            styles.ratingSelectedText
                                    ]}
                                >
                                    {ratingValue}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TextInput
                    style={styles.commentInput}
                    placeholder="Write your review..."
                    placeholderTextColor="#888888"
                    multiline
                    maxLength={1000}
                    value={comment}
                    onChangeText={setComment}
                />

                {reviewError ? (
                    <Text style={styles.reviewError}>
                        {reviewError}
                    </Text>
                ) : null}

                {reviewSuccess ? (
                    <Text style={styles.reviewSuccess}>
                        {reviewSuccess}
                    </Text>
                ) : null}

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitReview}
                    disabled={reviewLoading}
                >
                    {reviewLoading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.submitButtonText}>
                            Submit Review
                        </Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>
                    User Reviews ({reviews.length})
                </Text>

                {reviews.length === 0 ? (
                    <Text style={styles.noReviews}>
                        No reviews yet. Be the first to review!
                    </Text>
                ) : (
                    reviews.map((review) => (
                        <View key={review._id} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <Text style={styles.reviewerName}>
                                    {review.user?.name || "User"}
                                </Text>

                                <Text style={styles.reviewRating}>
                                    ⭐ {review.rating}/10
                                </Text>
                            </View>

                            <Text style={styles.reviewComment}>
                                {review.comment || "No comment provided."}
                            </Text>
                        </View>
                    ))
                )}

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#12121c"
    },
    center: {
        flex: 1,
        backgroundColor: "#12121c",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    loadingText: {
        color: "#aaaaaa",
        marginTop: 12
    },
    errorText: {
        color: "#ff7777",
        textAlign: "center"
    },
    backButton: {
        backgroundColor: "#7655d9",
        padding: 12,
        borderRadius: 8,
        marginTop: 20
    },
    backButtonText: {
        color: "#ffffff"
    },
    backLink: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        gap: 8
    },
    backText: {
        color: "#ffffff"
    },
    poster: {
        width: "100%",
        height: 350
    },
    posterPlaceholder: {
        height: 350,
        backgroundColor: "#252536",
        justifyContent: "center",
        alignItems: "center"
    },
    placeholderText: {
        color: "#aaaaaa"
    },
    content: {
        padding: 20
    },
    type: {
        color: "#a78bfa",
        fontWeight: "bold",
        fontSize: 12
    },
    title: {
        color: "#ffffff",
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 8
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 12
    },
    rating: {
        color: "#facc15",
        fontWeight: "bold"
    },
    ratingCount: {
        color: "#aaaaaa",
        fontSize: 12
    },
    favoriteButton: {
        backgroundColor: "#7655d9",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20
    },
    favoriteActive: {
        backgroundColor: "#8B2525"
    },
    favoriteText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 14
    },
    sectionTitle: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 28,
        marginBottom: 10
    },
    description: {
        color: "#cccccc",
        lineHeight: 24
    },
    metadata: {
        marginTop: 20,
        gap: 14
    },
    metadataItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    metadataText: {
        color: "#cccccc"
    },
    genreContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8
    },
    genreBadge: {
        backgroundColor: "#252536",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20
    },
    genreText: {
        color: "#ffffff",
        fontSize: 12
    },
    reviewLabel: {
    color: "#cccccc",
    marginBottom: 12
    },
    ratingPicker: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8
    },
    ratingOption: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: "#252536",
        justifyContent: "center",
        alignItems: "center"
    },
    ratingSelected: {
        backgroundColor: "#7655d9"
    },
    ratingOptionText: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    ratingSelectedText: {
        color: "#ffffff"
    },
    commentInput: {
        backgroundColor: "#252536",
        color: "#ffffff",
        borderRadius: 10,
        padding: 14,
        marginTop: 16,
        minHeight: 100,
        textAlignVertical: "top"
    },
    reviewError: {
        color: "#ff7777",
        marginTop: 10
    },
    reviewSuccess: {
        color: "#4ade80",
        marginTop: 10
    },
    submitButton: {
        backgroundColor: "#7655d9",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 14
    },
    submitButtonText: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    noReviews: {
        color: "#aaaaaa",
        marginBottom: 20
    },
    reviewCard: {
        backgroundColor: "#252536",
        padding: 14,
        borderRadius: 10,
        marginBottom: 12
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    reviewerName: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    reviewRating: {
        color: "#facc15",
        fontWeight: "bold"
    },
    reviewComment: {
        color: "#cccccc",
        lineHeight: 22
    }
});

export default DetailScreen;
