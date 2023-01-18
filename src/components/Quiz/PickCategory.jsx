import { useContext } from "react";
import { MenuItem, TextField } from '@material-ui/core'


import { QuizContext } from "../../context/quiz";
import Image from 'next/image'
import Category from '../../assets/category.png';

import { PickCate } from './styles'

const PickCategory = ({ name , setName  }) => {
  const [quizState, dispatch] = useContext(QuizContext);

  function chooseCategoryAndReorderQuestions(category) {

    
    dispatch({ type: "START_GAME", payload: category });

    dispatch({ type: "REORDER_QUESTIONS" });
  }
  const styles = {
    textField: {
    fontSize: 150, //works!
 }
}

  return (
    <>
    <PickCate>

    <div className="settings_select">
          <TextField
            fontSize="30px"
            style={{ marginBottom: 35 }}
            label="Digite seu Apelido: "
            variant="outlined"
            inputProps={{style: {fontSize: 18}}} // font size of input text
            onChange={(e) => setName(e.target.value)}
          />
           <TextField
            select
            style={{ marginBottom: 30 }}
            label="Selecione o nível de dificuldade:"
            inputProps={{style: {fontSize: 25}}} // font size of input text
            variant="outlined"
          >
            <MenuItem key="Facil" value="facil">
              <div className="fac">
              Fácil
              </div>
           
            </MenuItem>
            <MenuItem key="Medio " value="medio">
            <div className="fac">
              Médio
              </div>
            </MenuItem>
            <MenuItem key="Dificil" value="dificil">
            <div className="fac">
             Díficil
              </div>
            </MenuItem>
          </TextField>
      </div>
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
              width={600}
              height={400}
              />
        </div>
    </div>
    </PickCate>
    </>
  );
};

export default PickCategory;
