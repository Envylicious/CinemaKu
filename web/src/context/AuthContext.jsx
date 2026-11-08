import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );
    const [loading, setLoading] = useState(true);

    // Memeriksa apakah token yang tersimpan masih valid
    useEffect(() => {
        const checkLogin = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(response.data.user || response.data);
            } catch (error) {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkLogin();
    }, [token]);

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

        const { token: newToken, user: userData } = response.data;

        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(userData);

        return userData;
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
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

// Menggunakan AuthContext
export function useAuth() {
    return useContext(AuthContext);
}
