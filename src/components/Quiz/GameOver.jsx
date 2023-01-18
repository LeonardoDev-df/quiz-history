import { useContext } from "react";

import { QuizContext } from "../../context/quiz";
import Image from 'next/image'
import WellDone from '../../assets/welldone.png';

import { GameOveri } from './styles'

const GameOver = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  return (
    <>
    <GameOveri>
    <div className="gameover">
      <h2>Fim de jogo!</h2>
      <p>Sua pontuação: {quizState.score * 10}</p>
      <p>
        Você acertou {quizState.score} de {quizState.questions.length}{" "}
        perguntas.
      </p>
      <div className="imge">
          <Image  
              src={WellDone} 
              alt="Laptops" 
              placeholder="blur" 
              width={600}
              height={400}
              />
        </div>
      <button onClick={() => dispatch({ type: "NEW_GAME" })}>Reiniciar</button>
    </div>
    </GameOveri>
    </>
  );
};

export default GameOver;
