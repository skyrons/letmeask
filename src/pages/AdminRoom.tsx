import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { UseAuth } from '../hooks/useAuth';

import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Roomcode } from '../components/RoomCode';
import { Question } from '../components/Question';

import { database } from '../services/firebase';
import { ref, set, push } from 'firebase/database';
import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const { user } = UseAuth();
  const params : any = useParams<RoomParams>();
  const [ newQuestion, setNewQuestion ] = useState('');
  const roomId = params.id;
  
  const { title, questions } = useRoom(roomId)  

  async function handleSendQuestion(event:FormEvent) {
    event.preventDefault();

    if(newQuestion.trim() === ''){
      return;
    }

    if(!user){
      throw new Error('You must be logged in');
    }

    const questionRef =  ref(database, `rooms/${roomId}/questions`)
    const question = await push(questionRef);
    set(question, {
        content: newQuestion,
        author: {
          name: user.name,
          avatar: user.avatar,
        },
        isHighlighted : false,
        isAnswered: false
    })

    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <div>
            <Roomcode code={roomId}/>
            <Button isOutlined>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <div className="question-list">
          {questions.map( question => {
            return(
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              />
            );
          })}
        </div>
      </main>
    </div>
  )
}