
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet
} from "react-native";

import HomeScreen from "./src/screens/HomeScreen";
import DetailScreen from "./src/screens/DetailScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

import { AuthProvider, useAuth } from "./src/context/AuthContext";

const Stack = createNativeStackNavigator();

function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#a78bfa" />
                <Text style={styles.loadingText}>
                    Loading CinemaKu...
                </Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#12121c"
                    },
                    headerTintColor: "#ffffff",
                    headerTitleStyle: {
                        fontWeight: "bold"
                    },
                    contentStyle: {
                        backgroundColor: "#12121c"
                    }
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: "CinemaKu",
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="Detail"
                    component={DetailScreen}
                    options={{
                        title: "Detail Content"
                    }}
                />

                {user ? (
                    <Stack.Screen
                        name="Favorites"
                        component={FavoritesScreen}
                        options={{
                            title: "My Favorites"
                        }}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{
                                title: "Login"
                            }}
                        />

                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{
                                title: "Register"
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: "#12121c",
        justifyContent: "center",
        alignItems: "center"
    },
    loadingText: {
        color: "#aaaaaa",
        marginTop: 12
    }
});

export default App;
