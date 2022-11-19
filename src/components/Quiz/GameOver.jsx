import { useContext } from "react";

import { QuizContext } from "../../context/quiz";

import WellDone from "../../img/welldone.svg";

import { GameOveri } from './styles'

const GameOver = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  return (
    <>
    <GameOveri>
    <div className="gameover">
      <h2>Fim de jogo!</h2>
      <p>Pontuação: {quizState.score}</p>
      <p>
        Você acertou {quizState.score} de {quizState.questions.length}{" "}
        perguntas.
      </p>
      <img src={WellDone} alt="Fim do Quiz" />
      <button onClick={() => dispatch({ type: "NEW_GAME" })}>Reiniciar</button>
    </div>
    </GameOveri>
    </>
  );
};

export default GameOver;
