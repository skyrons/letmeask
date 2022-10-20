import { useState, useEffect } from 'react';
import { off, onValue, ref } from 'firebase/database';
import { database } from '../services/firebase';
import { UseAuth } from './useAuth';

type FirebaseQuestions = Record<string, {
  author:{
    name: string,
    avatar: string,
  }
  content: string
  isAnswered: boolean,
  isHighlighted: boolean
  likes: Record<string, {
    authorId: string;
  }>,
}>

type QuestionType = {
  id: string,
  author:{
    name: string,
    avatar: string,
  }
  content: string
  isAnswered: boolean,
  isHighlighted: boolean,
  likeCount: number,
  likeId: string | undefined,
}

export function useRoom(roomId: string) {
  const [ questions, setQuestions ] = useState<QuestionType[]>([]);
  const { user } = UseAuth();
  const [ title, setTitle ] = useState('')

  useEffect(() => {
    const roomRef = ref(database,`rooms/${roomId}`);
    onValue(roomRef, room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions =  Object.entries(firebaseQuestions).map( ([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      });

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })  

    return () => off(roomRef)
  }, [roomId, user?.id])

  return{ title, questions };

}