import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    auth,
} from "../firebase/firebase";

import {
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({
    children,
}) => {
    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const unsubscribe =
            onAuthStateChanged(
                auth,
                (currentUser) => {
                    setUser(currentUser);
                    setLoading(false);
                }
            );

        return unsubscribe;
    }, []);

    const logout = () => {
        if (user && user.uid === "demo-user") {
            setUser(null);
        } else {
            return signOut(auth);
        }
    };

    const loginAsDemo = () => {
        setUser({
            email: "demo@finflow.com",
            displayName: "Varun K T (Demo)",
            uid: "demo-user",
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                logout,
                loginAsDemo,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);