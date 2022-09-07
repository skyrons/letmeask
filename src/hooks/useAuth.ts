import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';

export function UseAuth(){
  const value = useContext(AuthContext);

  return value;
}