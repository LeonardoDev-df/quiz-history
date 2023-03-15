import { useContext, useState, useEffect } from "react";
import { QuizContext } from "../../context/quiz";
import Image from 'next/image'

import { Welcom, QuizHome } from './styles'

import AssetLogo from '../../assets/Quiz.png';
import { Options  } from './styles'

const Welcome = ({option}) => {
  const [quizState, dispatch] = useContext(QuizContext);
  const currentQuestion = quizState.questions[quizState.currentQuestion];
   // {currentQuestion.titulos.map((titulos) => (
  //  console.log(titulos.titulo)
    

  //))}

  console.log(currentQuestion.titulos)


  

  function chooseTituloAndReorderQuestions(titulo, option) {

    
    dispatch({ type: "START_GAME", payload: titulo });

    dispatch({ type: "REORDER_QUESTIONS" });
  }
  const styles = {
    textField: {
    fontSize: 150, //works!
 }
}
function chooseTituloAndReorderQuestion(titulo, option) {
  var numerosPares = quizState.questions.filter((question) => {
     
    
  
  })
 alert("Nenhuma questão cadastrada!")
}




  return (
    <>
    <Welcom>
    <h2>Escolha o Título</h2>

    <div className="welcome">
      
      {quizState.questions.filter(question => question.category == "Museu").map(filteredPerson =>(
       
          <>
           <button
            onClick={() => chooseTituloAndReorderQuestions(filteredPerson.category)}
            key= {filteredPerson.category}
            >
              <ul className="fi">
              <li>
              {quizState.questions.map((user, index) => (
                   <option className='opt'
                  id="categoria" value={user.titulo}>{`${user.titulo}`}</option>
                  ))}  
          
              </li>
              </ul>
            </button>

           
          </> 
       
      ))}
      
    </div>
   <div className="imge">
    <Image  
        src={AssetLogo} 
        alt="Laptops" 
        placeholder="blur" 
        width={600}
        height={380}
        />
   </div>
 
    </Welcom>
    </>
  );
};

export default Welcome;
