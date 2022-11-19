import { useContext } from "react";
import { QuizContext } from "../../context/quiz";
import Image from 'next/image'

import { Welcom, QuizHome } from './styles'


const Welcome = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  return (
    <>
    <Welcom>
    <div className="welcome">
      <h2>Seja bem-vindo</h2>

      <button onClick={() => dispatch({ type: "CHANGE_STAGE" })}>
        Iniciar
      </button>
       
        
       
    </div>
    </Welcom>
    <div >
    <QuizHome />
    </div>
   
    </>
  );
};

export default Welcome;
