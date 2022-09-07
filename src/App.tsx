import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {createContext} from 'react';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

export const TestContext = createContext('')

function App() {
  return (
    <BrowserRouter>
    <TestContext.Provider value='Teste'>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/rooms/new" element={<NewRoom/>}/>  
      </Routes>
      </TestContext.Provider>
    </BrowserRouter>
  );
}

export default App;