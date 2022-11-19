import styled, { css } from 'styled-components'

import AssetLogo from '../../assets/Quizee.svg';

export const QuizHome = styled(Object(AssetLogo))`
width: 80%;
height: auto;

@media screen and (max-width: 540px) {
    display: none;
}
`;



export const GameOveri = styled.div`
.gameover {
    text-align: center;
    max-width: 500px;
    display: flex;
    flex-direction: column;
  }

  .gameover h2,
  .gameover p {
    margin-bottom: 1rem;
  }

  .gameover p {
    color: #8435de;
  }

  .gameover img {
    margin: 2rem auto;
    height: 200px;
  }
`

export const Options = styled.div`
.option {
    background-color: #3c0e70;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
    opacity: 0.8;
    transition: 0.4s;
  }

  .option:hover {
    opacity: 1;
  }

  #options-container .option p {
    margin-bottom: 0;
  }

  .correct {
    background-color: #0bfc03;
    font-weight: bold;
  }

  .wrong {
    background-color: #3c0e70;
    opacity: 0.5;
  }

  .hide {
    display: none;
  }

`

export const Welcom = styled.div`
.welcome {
    text-align: center;
    max-width: 200px;
    height: 10px;
  }

  .welcome img{
    height: 100px;
  }

  .welcome h2,
  .welcome p {
    margin-bottom: 1rem;
  }

  .welcome p {
    color: #8435de;
  }
`
export const PickCate= styled.div`
.category {
    text-align: center;
    max-width: 500px;
  }

  .category h2,
  .category p {
    margin-bottom: 1rem;
  }

  .category p {
    color: #8435de;
  }

  .category img {
    margin-top: 2rem;
    max-width: 300px;
  }

  .category button {
    margin: 1rem;
  }
`

export const Quest = styled.div`
.question {
    background-color: #8435de;
    border-radius: 1rem;
    padding: 2rem;
    width: 500px;
  }

  .question p {
    margin-bottom: 1rem;
  }

  .question h2 {
    margin-bottom: 2rem;
  }

  .question button {
    border: 2px solid #fff;
    margin: 1rem;
  }
`
