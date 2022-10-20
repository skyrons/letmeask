import { FormEvent, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';

import { UseAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';

import { database } from '../services/firebase';
import { ref, set, push } from 'firebase/database';

import '../styles/auth.scss'

export function NewRoom() {

  const { user } = UseAuth()
  const [ newRoom, setNewRoom ] = useState('');
  const history = useNavigate()

  async function handleCreateRoom(event:FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === ''){
      return;
    }

    const roomRef = ref(database, 'rooms');

    const firebaseRoom = await push(roomRef);
    set(firebaseRoom, {
      title: newRoom,
      authorId: user?.id
    })
    
    history(`/Admin/rooms/${firebaseRoom.key}`)
    console.log(firebaseRoom.key)

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
          <h1>{user?.name}</h1>
          <h2>Crie uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text"
              placeholder="Digite o nome da sala" 
              onChange={event => setNewRoom(event.target.value)}
              value = { newRoom }
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrarem uma já existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}