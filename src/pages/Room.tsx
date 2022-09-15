import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { Roomcode } from '../components/RoomCode';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function Room() {
  
  const params : any = useParams<RoomParams>();

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <Roomcode code={params.id}/>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala React Q&A</h1>
          <span>4 preguntas</span>
        </div>

        <form action="">
          <textarea 
            placeholder='O que você quer perguntar?'  
          />

          <div className="form-footer">
            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            <Button>Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  )
}