import { useContext, useState, useEffect } from "react";

import { QuizContext } from "../../context/quiz";

import Option from "./Option";

import { Quest } from './styles'

const Questi = ({ name, score}) => {
 
  
  const onSelectOption = (option) => {
    dispatch({
      type: "CHECK_ANSWER",
      payload: { answer: currentQuestion.answer, option },
    });
  };


  return (
    <>
  
    <div className="question">
      <span className="subtitle">
        Bem Vindo!  {name}
      </span>
      
    </div>
  
    </>
  );
};

export default Questi;
