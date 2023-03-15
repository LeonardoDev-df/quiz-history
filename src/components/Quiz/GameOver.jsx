import { useContext } from "react";
import { MenuItem, TextField } from '@material-ui/core'

import { QuizContext } from "../../context/quiz";
import Image from 'next/image'
import WellDone from '../../assets/welldone.png';

import { GameOveri } from './styles'


export async function cadastrarUsuario(event) {
  
  const form = document.forms["create_user"];

  const apelido = form["complete_name"].value;
 
  if (apelido === "" ) {
    alert("Por favor preencha os campos.");
    return
    event.preventDefault();
  }
  const pontos = pontua
  let emblema
  if (pontos < 50){
    emblema = "https://www.imagemhost.com.br/images/2023/02/09/bronze.png"
  }else if(pontos == 50 || pontos <= 90){
    emblema = "https://www.imagemhost.com.br/images/2023/02/09/silver-1.png"
  }else{
      emblema =  "https://uploaddeimagens.com.br/images/004/180/413/original/materialss.png?1669491785"
  }
  
  const data = {
    apelido,
    pontos,
    emblema,
  };

  try {
    const result = await fetch(
      "http://localhost:3333/users",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (result.ok) {   
      alert("Usuário cadastrado com sucesso.");
    } else {
      alert("Usuário já existe.");
    }
  } catch (error) {
    alert("Erro ao cadastrar usuário");
    console.log(`error.message`, error.message);
  }

}

var pontua

const GameOver = ({score, setScore  }) => {
  const [quizState, dispatch] = useContext(QuizContext);


  pontua = quizState.score * 10
 
  return (
    <>
    <GameOveri>

    

    <div className="gameover">
      <h2>Fim de jogo!</h2>
      <p>Sua pontuação: {quizState.score * 10}</p>
      <p>
        Você acertou {quizState.score} de {quizState.questions.length}{" "}
        perguntas.
      </p>
      <div>
          <form id="create_user">
            <input
            className="settings_select"
              placeholder="Digite seu apelido:"
              name="complete_name"
              id="complete_name"
              type="text"
              required
            />   
          </form>
    </div>
      <div className="imge">
          <Image  
              src={WellDone} 
              alt="Laptops" 
              placeholder="blur" 
              width={500}
              height={350}
              />
        </div>
      
    </div>
    <button className="butto" onClick={() => dispatch({ type: "SAVE_GAME" })}>SALVAR O JOGO </button>
    <button className="button" onClick={() => dispatch({ type: "NEW_GAME" })}>REINICIAR </button>
    </GameOveri>
    </>
    
  );
};



export default GameOver;
