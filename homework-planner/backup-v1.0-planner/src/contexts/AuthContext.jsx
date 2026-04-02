import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseAvailable } from '../firebase';
import { userService } from '../services/userService';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    sendPasswordResetEmail,
    sendEmailVerification
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const GUEST_USER = { uid: 'guest-user-123', email: 'guest@local.app' };

    // Helper to refresh profile (e.g. after upgrade)
    async function refreshProfile() {
        if (currentUser) {
            const profile = await userService.getProfile(currentUser);
            setUserProfile(profile);
        }
    }

    async function signup(email, password) {
        try {
            if (isFirebaseAvailable) {
                const userCred = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCred.user;
                const profile = await userService.getProfile(user);
                setCurrentUser(user);
                setUserProfile(profile);
                return user;
            }
            setCurrentUser(GUEST_USER);
            localStorage.setItem('local_auth_user', JSON.stringify(GUEST_USER));
            return GUEST_USER;
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        }
    }

    async function login(email, password) {
        try {
            if (isFirebaseAvailable) {
                const userCred = await signInWithEmailAndPassword(auth, email, password);
                const user = userCred.user;
                const profile = await userService.getProfile(user);
                setCurrentUser(user);
                setUserProfile(profile);
                return user;
            }
            setCurrentUser(GUEST_USER);
            localStorage.setItem('local_auth_user', JSON.stringify(GUEST_USER));
            return GUEST_USER;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    function loginWithGoogle() {
        if (!isFirebaseAvailable) return login("guest", "guest"); // Fallback
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    function sendMagicLink(email) {
        if (!isFirebaseAvailable) return Promise.resolve();
        const actionCodeSettings = {
            url: window.location.origin + '/login', // Redirect back to login to finish
            handleCodeInApp: true,
        };
        return sendSignInLinkToEmail(auth, email, actionCodeSettings);
    }

    function completeMagicLinkLogin(email, href) {
        if (!isFirebaseAvailable) return login("guest", "guest");
        if (isSignInWithEmailLink(auth, href)) {
            return signInWithEmailLink(auth, email, href);
        }
        return Promise.reject("Invalid link");
    }

    async function earnXP(amount) {
        if (currentUser) {
            const result = await userService.awardXP(currentUser.uid, amount);
            await refreshProfile();
            return result;
        }
    }

    function logout() {
        if (isFirebaseAvailable) return signOut(auth);
        setCurrentUser(null);
        setUserProfile(null);
        localStorage.removeItem('local_auth_user');
        return Promise.resolve();
    }

    function resetPassword(email) {
        if (!isFirebaseAvailable) return Promise.resolve();
        return sendPasswordResetEmail(auth, email);
    }

    function sendVerificationEmail() {
        if (!isFirebaseAvailable || !currentUser) return Promise.resolve();
        return sendEmailVerification(currentUser);
    }

    // Load User & Profile
    useEffect(() => {
        async function handleUser(user) {
            if (user) {
                setCurrentUser(user);
                const profile = await userService.getProfile(user);
                setUserProfile(profile);
            } else {
                setCurrentUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        }

        if (isFirebaseAvailable) {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                handleUser(user);
            });
            return unsubscribe;
        } else {
            const localUser = localStorage.getItem('local_auth_user');
            if (localUser) {
                handleUser(JSON.parse(localUser));
            } else {
                setLoading(false);
            }
        }
    }, []);

    // Clean, readable context value
    const value = {
        currentUser,
        userProfile,
        // Helper: Check if user is on the premium plan
        isPremium: userProfile?.plan === 'premium',
        refreshProfile,
        signup,
        login,
        logout,
        resetPassword,
        loginWithGoogle,
        earnXP,
        isFirebaseAvailable,
        sendVerificationEmail
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
