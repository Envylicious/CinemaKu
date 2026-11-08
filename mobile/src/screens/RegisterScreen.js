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

function RegisterScreen({ navigation }) {
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Semua field wajib diisi.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Password tidak cocok.");
            return;
        }

        if (password.length < 8) {
            setError("Password minimal 8 karakter.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await register(name.trim(), email.trim(), password);

            navigation.replace("Login");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registrasi gagal. Silakan coba lagi."
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

                <Text style={styles.heading}>Create Account</Text>

                <Text style={styles.subtitle}>
                    Buat akun untuk menikmati CinemaKu.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                />

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
                    placeholder="Password (minimal 8 karakter)"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#888"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                {error ? (
                    <Text style={styles.error}>{error}</Text>
                ) : null}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.buttonText}>Register</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.loginRow}>
                    <Text style={styles.loginText}>
                        Sudah punya akun?
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={styles.loginLink}> Login</Text>
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
    loginRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24
    },
    loginText: {
        color: "#aaaaaa"
    },
    loginLink: {
        color: "#a78bfa",
        fontWeight: "bold"
    }
});

export default RegisterScreen;