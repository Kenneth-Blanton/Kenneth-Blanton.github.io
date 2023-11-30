import { useContext, createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  getRedirectResult,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    signInWithRedirect(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        const user = result.user;
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          // User doesn't exist, create a new document with the user's info
          await setDoc(userRef, {
            username: user.displayName,
            profilePicture: user.photoURL,
            email: user.email,
            createdat: new Date(),
            lastActive: new Date(),
            notesMade: [],
            booksMade: [],
            friendList: [],
            isMember: false,
            // Add other info you want to store
          });
        } else {
          updateDoc(userRef, {
            lastActive: new Date(),
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
