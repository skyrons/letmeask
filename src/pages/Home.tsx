import { useNavigate } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';

import { UseAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { get, onValue, ref } from 'firebase/database';
import { database } from '../services/firebase';

import { Button } from '../components/Button';

import '../styles/auth.scss'

export function Home() {
  const { user, sigInWithGoogle } = UseAuth();
  const history = useNavigate();
  const [ roomCode, setRoomCode ] = useState('');
  
  
  async function handleCreateRoom(){
    if(!user){
      await sigInWithGoogle();
    }
    
    history('/rooms/new');
    
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault();

    if(roomCode.trim() === '') {
      return;
    }

    const roomRef = await get(ref(database, `rooms/${roomCode}`));

    if(!roomRef.exists()) {
      alert('Room does not exists');
      return;
    }

    if(roomRef.val().closedAt){
      alert('Room is already closed')
      return;
    }

    const authorRef = await ref(database, `rooms/${roomCode}/authorId`);
    onValue(authorRef, authorId => {
      const author = authorId.val();
      if(author == user?.id){
        history(`/Admin/rooms/${roomCode}`);
      }
    })
    

    history(`/rooms/${roomCode}`);
    
  }

  return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Toda pergunta tem resposta</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className='create-room'>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className='separator'>ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text"
              placeholder="Digite o código da sala" 
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}