import React, { useState, useContext, useEffect } from 'react';



// Styles
import { Global, Wra } from './App.styles';

import { QuizContext } from "../../../../context/quiz";

import { Loading } from '../../../../components/Loading'
import Welcome from "../../../../components/Quiz/Welcome";
import Question from "../../../../components/Quiz/Question";
import GameOver from "../../../../components/Quiz/GameOver";
import PickCategory from "../../../../components/Quiz/PickCategory";



import {
    Container,
    PaperStart,
    StFormStart,
    FormGroup,
    Appx,
    Copy,
    StForm,
    FormInputContainer
} from '../../../../styles/pages/shared/control-panel.styles'



const App: React.FC = () => {

    const [isLoading, setIsLoading] = useState(false)

    const [quizState, dispatch] = useContext(QuizContext);


  return (
    <>
       
       <Appx>
          <h1>Quiz History</h1>
                           
          <div className="App">

            {quizState.gameStage === "Start" && <Welcome />}
            {quizState.gameStage === "Category" && <PickCategory />}
            {quizState.gameStage === "Playing" && <Question />}
            {quizState.gameStage === "End" && <GameOver />}
          </div>
        </Appx>
        <Loading isVisible={isLoading} />
        <Copy>&copy; 2021 RVHistory. All right reserved.</Copy>
    </>
  );
};

export default App;
