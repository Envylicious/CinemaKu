import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import { useAuth } from "../context/AuthContext";

import api from "../services/api";

function HomeScreen({ navigation }) {
    const { user, logout } = useAuth();

    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("");

    const fetchContents = async () => {
        try {
            setLoading(true);

            const response = await api.get("/contents", {
                params: {
                    search: search,
                    type: selectedType
                }
            });

            setContents(
                response.data.contents || response.data
            );
        } catch (error) {
            console.error("Failed to fetch contents:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContents();
    }, [search, selectedType]);

    const categories = [
        { label: "All", value: "" },
        { label: "Movies", value: "movie" },
        { label: "Series", value: "series" },
        { label: "Music", value: "music" }
    ];

    const renderContent = ({ item }) => (
    <TouchableOpacity
        style={styles.card}
        onPress={() => {
            console.log("Selected content:", item._id);

            navigation.navigate("Detail", {
                contentId: item._id
            });
        }}
    >
        {item.poster ? (
            <Image
                source={{ uri: item.poster }}
                style={styles.poster}
            />
        ) : (
            <View style={styles.posterPlaceholder}>
                <Text style={styles.placeholderText}>
                    No Poster
                </Text>
            </View>
        )}

        <Text style={styles.title} numberOfLines={1}>
            {item.title}
        </Text>

        <Text style={styles.info}>
            {item.type} • {item.releaseYear || "Unknown"}
        </Text>

        <Text style={styles.rating}>
            ★ {Number(item.rating || 0).toFixed(1)} / 10
        </Text>
    </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
        <View style={styles.authNavigation}>
            {user ? (
                <>
                    <Text style={styles.welcomeText}>
                        Hi, {user.name}
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Favorites")}
                    >
                        <Text style={styles.navButton}>
                            Favorites
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={logout}>
                        <Text style={styles.navButton}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={styles.navButton}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.navButton}>Register</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
            <Text style={styles.heading}>CinemaKu</Text>

            <Text style={styles.subtitle}>
                Carilah EntertainmentMu
            </Text>

            <TextInput
                style={styles.searchInput}
                placeholder="Cari film, series, atau musik..."
                placeholderTextColor="#888"
                value={search}
                onChangeText={setSearch}
            />

            <View style={styles.categories}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.value || "all"}
                        style={[
                            styles.categoryButton,
                            selectedType === category.value &&
                                styles.activeCategory
                        ]}
                        onPress={() => setSelectedType(category.value)}
                    >
                        <Text style={styles.categoryText}>
                            {category.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#a78bfa" />
            ) : (
                <FlatList
                    data={contents}
                    renderItem={renderContent}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            Tidak ada konten ditemukan.
                        </Text>
                    }
                />
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#12121c",
        padding: 16
    },
    heading: {
        color: "#ffffff",
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 20
    },
    subtitle: {
        color: "#aaaaaa",
        marginTop: 5,
        marginBottom: 20
    },
    searchInput: {
        backgroundColor: "#252536",
        color: "#ffffff",
        padding: 14,
        borderRadius: 10,
        marginBottom: 16
    },
    categories: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 20
    },
    categoryButton: {
        backgroundColor: "#252536",
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 20
    },
    activeCategory: {
        backgroundColor: "#7655d9"
    },
    categoryText: {
        color: "#ffffff",
        fontSize: 12
    },
    list: {
        paddingBottom: 30
    },
    row: {
        justifyContent: "space-between"
    },
    card: {
        width: "48%",
        backgroundColor: "#252536",
        padding: 10,
        borderRadius: 12,
        marginBottom: 16
    },
    poster: {
        width: "100%",
        height: 190,
        borderRadius: 8
    },
    posterPlaceholder: {
        height: 190,
        backgroundColor: "#38384c",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    placeholderText: {
        color: "#aaaaaa"
    },
    title: {
        color: "#ffffff",
        fontWeight: "bold",
        marginTop: 10
    },
    info: {
        color: "#aaaaaa",
        fontSize: 11,
        marginTop: 4
    },
    rating: {
        color: "#facc15",
        marginTop: 6,
        fontSize: 12
    },
    emptyText: {
        color: "#aaaaaa",
        textAlign: "center",
        marginTop: 30
    },
    authNavigation: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 16,
        marginTop: 10,
        marginBottom: 10
    },
    welcomeText: {
        color: "#aaaaaa",
        fontSize: 12
    },
    navButton: {
        color: "#a78bfa",
        fontWeight: "bold",
        fontSize: 13
    }
});

export default HomeScreen;