import React, { useState, useContext, useEffect } from 'react';



// Styles
import { Global, Wra } from './App.styles';

import { QuizContext } from "../../../../context/quiz";

import { Loading } from '../../../../components/Loading'
import Welcome from "../../../../components/Quiz/Welcome";
import Question from "../../../../components/Quiz/Question";
import GameOver from "../../../../components/Quiz/GameOver";
import PickCategory from "../../../../components/Quiz/PickCategory";



import { PaperStart, Copy, Container } from '../../../../styles/pages/shared/control-panel.styles'


const App: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [name, setName ] = useState("")
    const [quizState, dispatch] = useContext(QuizContext);
    const [score, setScore] = useState(0)

  return (
    <>
       <PaperStart>
                  
          <div className="App">
          
            {quizState.gameStage === "Start" && <Welcome />}
            {quizState.gameStage === "Category" && <PickCategory name={name} setName={setName}/>}
            {quizState.gameStage === "Playing" && <Question name={name} score={score}/>}
            {quizState.gameStage === "End" && <GameOver />}
          </div>
       
        
        </PaperStart>
        <Loading isVisible={isLoading} />
        <Copy>&copy; 2021 RVHistory. All right reserved.</Copy>
    </>
  );
};

export default App;
