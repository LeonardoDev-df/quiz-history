import { useContext } from "react";

import { QuizContext } from "../../context/quiz";

import { Options  } from './styles'

const Option = ({ option, selectOption, answer, hide }) => {
  const [quizState, dispatch] = useContext(QuizContext);

  return (
    <>
    <Options>
    <div
      onClick={() => selectOption()}
      className={`
      option
        ${quizState.answerSelected && option === answer ? "correct" : ""} ${
        quizState.answerSelected && option !== answer ? "wrong" : ""
      }
        ${hide ? "hide" : ""}
        `}
    >
      <p>{option}</p>
    </div>
    </Options>
    </>
  );
};

export default Option;
