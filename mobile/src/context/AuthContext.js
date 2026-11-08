import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Memeriksa sesi login ketika aplikasi dibuka
    useEffect(() => {
        const loadUser = async () => {
            try {
                const savedToken = await AsyncStorage.getItem("token");

                if (savedToken) {
                    setToken(savedToken);

                    const response = await api.get("/users/me", {
                        headers: {
                            Authorization: `Bearer ${savedToken}`
                        }
                    });

                    setUser(response.data.user || response.data);
                }
            } catch (error) {
                console.error("Session error:", error.message);

                await AsyncStorage.removeItem("token");
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Register
    const register = async (name, email, password) => {
        const response = await api.post("/auth/register", {
            name,
            email,
            password
        });

        return response.data;
    };

    // Login
    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password
        });

        const newToken = response.data.token;
        const userData = response.data.user;

        await AsyncStorage.setItem("token", newToken);

        setToken(newToken);
        setUser(userData);

        return response.data;
    };

    // Logout
    const logout = async () => {
        await AsyncStorage.removeItem("token");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                register,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook untuk menggunakan AuthContext
export function useAuth() {
    return useContext(AuthContext);
}
