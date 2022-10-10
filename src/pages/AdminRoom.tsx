import { useNavigate, useParams } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Roomcode } from '../components/RoomCode';
import { Question } from '../components/Question';

import { database } from '../services/firebase';
import { ref, remove, update } from 'firebase/database';
import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params : any = useParams<RoomParams>();
  const roomId = params.id;
  
  const { title, questions } = useRoom(roomId)
  const history = useNavigate()

  async function handleCloseRoom() {
    await update(ref(database, `rooms/${roomId}`), {
      closedAt: new Date(),
    });

    history('/');
  }

  async function handleHighlightQuestion(questionId: string) {
    await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
      isHighlighted: true,
    })
    
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
      isAnswered: true,
    })
  }

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
            <Button 
              isOutlined
              onClick={handleCloseRoom}
              >
                Encerrar Sala</Button>
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
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                
                {!question.isAnswered && (
                  <>
                    <button
                      type='button'
                      onClick={() => handleCheckQuestionAsAnswered(question.id) }
                    >
                    <img src={checkImg} alt="Marcar Pergunta como respondida" />  
                    </button>

                    <button
                      type='button'
                      onClick={() => handleHighlightQuestion(question.id) }
                    >
                    <img src={answerImg} alt="Dar destaque apergunta" />  
                    </button>
                  </>
                )}

                <button
                  type='button'
                  onClick={() => handleDeleteQuestion(question.id) }
                >
                <img src={deleteImg} alt="Remover Pergunta" />  
                </button>

            </Question>
            );
          })}
        </div>
      </main>
    </div>
  )
}