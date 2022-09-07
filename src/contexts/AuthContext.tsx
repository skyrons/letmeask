import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContxtType = {
  user: User | undefined;
  sigInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContxtType);

export function AuthContextProvider(props: AuthContextProviderProps) {

  const [user, setUser] = useState<User>();

  // Monitora se existia login feito com o usuário anteriormente
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        const { displayName, photoURL, uid } = user;

        if(!displayName || !photoURL){
          throw new Error('Missing information from Google Account.');
        }

        setUser({
          id:uid,
          name:displayName,
          avatar:photoURL
        })
      }
    })

    return() => {
      unsubscribe();
    }
  }, [])
  
  async function sigInWithGoogle() {

    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    if(result.user){
      const { displayName, photoURL, uid } = result.user;

      if(!displayName || !photoURL){
        throw new Error('Missing information from Google Account');
      }

      setUser({
        id:uid,
        name:displayName,
        avatar:photoURL
      })
    }
  }

  return(
    <AuthContext.Provider value={{user, sigInWithGoogle}}>
      {props.children}
    </AuthContext.Provider>
  );
}