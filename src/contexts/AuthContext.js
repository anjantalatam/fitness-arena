import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase-config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscirbe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscirbe();
    };
  }, []);

  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  function logout() {
    return signOut(auth);
  }

  const value = {
    user,
    loginWithGoogle,
    logout,
    uid: user?.uid,
    // takecare when signin with email and password
    username: user?.displayName,
    useremail: user?.email,
    isEmailVerified: user?.emailVerified,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
