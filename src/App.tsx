import { createContext, useState, useEffect} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { auth } from './services/firebase';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContxtType = {
  user: User | undefined;
  sigInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContxtType)

function App() {
  const [user, setUser] = useState<User>();

  // Monitora se existia login feito com o usuário anteriormente
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user){
        const { displayName, photoURL, uid } = user

        if(!displayName || !photoURL){
          throw new Error('Missing information from Google Account');
        }

        setUser({
          id:uid,
          name:displayName,
          avatar:photoURL
        })
      }
    })
  }, [])
  
  async function sigInWithGoogle() {

    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    if(result.user){
      const { displayName, photoURL, uid } = result.user

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

  return (
    <BrowserRouter>
    <AuthContext.Provider value={{user, sigInWithGoogle}}>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/rooms/new" element={<NewRoom/>}/>  
      </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;