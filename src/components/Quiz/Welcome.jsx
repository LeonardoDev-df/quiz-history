import { useContext } from "react";
import { QuizContext } from "../../context/quiz";
import Image from 'next/image'

import { Welcom, QuizHome } from './styles'

import AssetLogo from '../../assets/Quiz.png';


const Welcome = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  return (
    <>
    <Welcom>
    <div className="welcome">
      <h2>Quiz History</h2>

      <button onClick={() => dispatch({ type: "CHANGE_STAGE" })}>
        Iniciar
      </button>
    </div>
   <div className="imge">
    <Image  
        src={AssetLogo} 
        alt="Laptops" 
        placeholder="blur" 
        width={600}
        height={400}
        />
   </div>
 
    </Welcom>
    </>
  );
};

export default Welcome;
