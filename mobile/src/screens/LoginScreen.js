import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from "react-native";

import { useAuth } from "../context/AuthContext";

function LoginScreen({ navigation }) {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            setError("Email dan password wajib diisi.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await login(email.trim(), password);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Login gagal. Periksa email dan password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.logo}>CinemaKu</Text>

                <Text style={styles.heading}>
                    Welcome Back!
                </Text>

                <Text style={styles.subtitle}>
                    Login untuk menikmati entertainment favoritmu.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : null}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            Login
                        </Text>
                    )}
                </TouchableOpacity>

                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>
                        Belum punya akun?
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.registerLink}>
                            {" "}Register
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#12121c",
        justifyContent: "center",
        padding: 24
    },
    card: {
        backgroundColor: "#252536",
        padding: 24,
        borderRadius: 16
    },
    logo: {
        color: "#a78bfa",
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center"
    },
    heading: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20
    },
    subtitle: {
        color: "#aaaaaa",
        textAlign: "center",
        marginTop: 8,
        marginBottom: 28
    },
    input: {
        backgroundColor: "#38384c",
        color: "#ffffff",
        padding: 14,
        borderRadius: 10,
        marginBottom: 16
    },
    button: {
        backgroundColor: "#7655d9",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 8
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold"
    },
    error: {
        color: "#ff7777",
        marginBottom: 10
    },
    registerRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24
    },
    registerText: {
        color: "#aaaaaa"
    },
    registerLink: {
        color: "#a78bfa",
        fontWeight: "bold"
    }
});

export default LoginScreen;