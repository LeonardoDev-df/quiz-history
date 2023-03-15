import { useContext } from "react";
import { MenuItem, TextField } from '@material-ui/core'


import { QuizContext } from "../../context/quiz";
import Image from 'next/image'
import Category from '../../assets/category.png';

import { PickCate } from './styles'

const PickCategory = ({ name , setName  }) => {
 
  const [quizState, dispatch] = useContext(QuizContext);
  console.log(quizState)
  
  function chooseCategoryAndReorderQuestions(category, categories) {
    console.log(category)
    
    if(category == "Museu"){
      dispatch({ type: "CHANGE_STAGE", payload: category });
    }else{
      alert("Nenhum quiz cadastrado nesta categoria!")
    }
   

    //dispatch({ type: "REORDER_QUESTIONS" });
  }
  const styles = {
    textField: {
    fontSize: 150, //works!
 }
}

  return (
    <>
    <PickCate>

   
    <div className="category">
     

      <h2>Escolha uma categoria</h2>
      {quizState.questions.map((question) => (
        <button
        
          onClick={() => chooseCategoryAndReorderQuestions(question.category)}
          key={question.category}
        >
          {question.category}
        </button>
      ))}

      <div className="imge">
          <Image  
              src={Category} 
              alt="Laptops" 
              placeholder="blur" 
              width={850}
              height={650}
              />
        </div>
    </div>
    </PickCate>
    </>
  );
};

export default PickCategory;
