import { useContext } from "react";


import { QuizContext } from "./quiz";




const GameOver = ({ name , score  }) => {
  const [quizState, dispatch] = useContext(QuizContext);

  const pontos = quizState.score * 10
 
  return (
 <>
 </>
  );
};

export default GameOver;