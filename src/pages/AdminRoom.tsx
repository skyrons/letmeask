import { useParams } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';

import logoImg from '../assets/images/logo.svg';
import deleteQuestion from '../assets/images/delete.svg';

import { Button } from '../components/Button';
import { Roomcode } from '../components/RoomCode';
import { Question } from '../components/Question';

import { database } from '../services/firebase';
import { ref, remove } from 'firebase/database';
import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params : any = useParams<RoomParams>();
  const roomId = params.id;
  
  const { title, questions } = useRoom(roomId)  

  async function handleDeleteQuestion( questionId: string ){
    if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
      await remove(ref(database, `rooms/${roomId}/questions/${questionId}`))
    }
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
              >
              <button
                type='button'
                onClick={() => handleDeleteQuestion(question.id) }
              >
              <img src={deleteQuestion} alt="Remover Pergunta" />  
              </button>
            </Question>
            );
          })}
        </div>
      </main>
    </div>
  )
}