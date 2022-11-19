import styled, { css, createGlobalStyle } from 'styled-components'
import { rgba, darken, shade } from 'polished'
import { Form } from '@unform/web'
import Laptops from '../../../assets/laptops.png'




export const Global = createGlobalStyle`


  html {
   
    min-height: 50vh;
    height: 30%;
    background-color: #1c1c1c;
  }

  button {
    font-weight: bold;
    cursor: pointer;
    font-size: 2.2rem;
    padding: 0.8rem 1.5rem;
    background: linear-gradient(
      90deg,
      rgba(132, 53, 222, 1) 10%,
      rgba(184, 84, 232, 1) 110%
    );
    border-radius: 3rem;
    border: none;
  }

  button:hover {
    background: linear-gradient(
      90deg,
      rgba(184, 84, 232, 1) 0%,
      rgba(132, 53, 222, 1) 100%
    );
  }

`;


export const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
    width: 100%;
  }

  backgroundImage: url("../../../assets/laptops.png");



  h1 {
    font-family: Fascinate Inline;
    background-image: linear-gradient(180deg, #fff, #87f1ff);
    font-weight: 400;
    background-size: 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    filter: drop-shadow(2px 2px #0085a3);
    font-size: 70px;
    text-align: center;
    margin: 20px;
  }

  #category{
    width: 400px;
    margin-left: 130px;
  }

  #apelido{
    width: 400px;
    margin-left: 260px;
  }

  body {
    background-image: url("../../../assets/quiz.jpg");
    background-size: cover;
    margin: 0;
    padding: 0 20px;
    display: flex;
    justify-content: center;
  }

  * {
    font-family: 'Catamaran', sans-serif;
    box-sizing: border-box;
  }
`;

export const Wra = styled.div`
.App {
    text-align: center;
    padding-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .App h1 {
    margin-bottom: 2rem;
  }
`;


export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;



  > p {
    color: black;
  }

  .score {
    color: black;
    font-size: 2rem;
    margin: 0;
    padding-bottom: 10px;
  }


  .welcome {
    color: black;
    font-size: 2rem;
    margin: 0;
    padding-left: 72%;
    padding-bottom: 10px;
    padding-top: 10px;
  }

  h1 {
    font-family: Fascinate Inline;
    background-image: linear-gradient(180deg, #fff, #87f1ff);
    font-weight: 400;
    background-size: 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    filter: drop-shadow(2px 2px #0085a3);
    font-size: 70px;
    text-align: center;
    margin: 20px;
  }

  .start{
    cursor: pointer;
    background: linear-gradient(180deg, #ffffff, #ffcc91);
    border: 2px solid #d38558;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    height: 40px;
    margin: 25px 0;
    padding: 0 40px;
    margin-left: 400px;
  }

  .next {
    cursor: pointer;
    background: linear-gradient(180deg, #ffffff, #ffcc91);
    border: 2px solid #d38558;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    height: 40px;
    margin: 25px 0;
    padding: 0 40px;
    margin-left: 0px;
  }

  .start {
    max-width: 200px;
  }
`;
