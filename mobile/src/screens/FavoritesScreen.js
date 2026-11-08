import { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet
} from "react-native";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function FavoritesScreen({ navigation }) {
    const { token } = useAuth();

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        try {
            const response = await api.get("/favorites", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setFavorites(response.data.favorites || response.data);
        } catch (error) {
            console.error(
                "Failed to fetch favorites:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (contentId) => {
        try {
            await api.delete(`/favorites/${contentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setFavorites((previous) =>
                previous.filter((item) => item._id !== contentId)
            );
        } catch (error) {
            console.error(
                "Failed to remove favorite:",
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>My Favorites</Text>

            {favorites.length === 0 ? (
                <Text style={styles.emptyText}>
                    You haven't added any favorites yet.
                </Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <TouchableOpacity
                                style={styles.content}
                                onPress={() =>
                                    navigation.navigate("Detail", {
                                        contentId: item._id
                                    })
                                }
                            >
                                <Image
                                    source={{ uri: item.poster }}
                                    style={styles.poster}
                                />

                                <View style={styles.info}>
                                    <Text style={styles.title}>
                                        {item.title}
                                    </Text>
                                    <Text>{item.type}</Text>
                                    <Text>⭐ {item.rating}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => removeFavorite(item._id)}
                                style={styles.removeButton}
                            >
                                <Text style={styles.removeText}>
                                    Remove
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 16
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    heading: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20
    },
    emptyText: {
        color: "#AAAAAA",
        textAlign: "center",
        marginTop: 30
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#242424",
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
        alignItems: "center"
    },
    content: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    poster: {
        width: 65,
        height: 95,
        borderRadius: 6
    },
    info: {
        marginLeft: 12,
        flex: 1
    },
    title: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 6
    },
    removeButton: {
        backgroundColor: "#8B2525",
        padding: 9,
        borderRadius: 6
    },
    removeText: {
        color: "#FFFFFF",
        fontSize: 12
    }
});

export default FavoritesScreen;
