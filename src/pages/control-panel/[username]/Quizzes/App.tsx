import React, { useState, useContext, useEffect } from 'react';
import Link from '../../../../infra/components/Link'
import {
  QuizGaming,
  Footers,
  LogoFooters,
  FacebookIcons,
  InstagramIcons,
  ArrowRightIcons
} from '../../../../styles/pages/Home'

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
          
            
            {quizState.gameStage === "Start" && <PickCategory name={name} setName={setName}/>}
            {quizState.gameStage === "Category" && <Welcome />}
            {quizState.gameStage === "Playing" && <Question name={name} score={score} />}
            {quizState.gameStage === "End" && <GameOver />}
          </div>

          <Footers>
                <section>
                    <div>
                     
                        <p>
                        "Dê um peixe a um homem e você o alimentará por um dia; ensine um homem 
                        a pescar e você o alimentará por toda a vida." - Maimônides, filósofo  
                        </p>
                    </div>
                </section>

                <div>
                    <p>
                        &copy; 2023 Copyright. All right reserved. Develop with
                        ❤️ by <span>Leonardo Lopes</span>.
                    </p>
                </div>
            </Footers>
        
        </PaperStart>
        <Loading isVisible={isLoading} />
        
    </>
  );
};

export default App;
