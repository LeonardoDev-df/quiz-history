import styled, { css } from 'styled-components'


export const GameOveri = styled.div`
.gameover {
    text-align: center;
    max-width: 500px;
    display: flex;
    height: 566px;
    flex-direction: column;
  }

  

  .settings_select {
    position: absolute;
    display: flex;
    flex-direction: column;
    padding: 15px;
    margin-top: 10px;
    width: 16%;
    height: 8%;
    flex: 0.8;
    margin-left: -40px;
    border-radius: 35px;
    border: solid 2px;
    border-color:  #8435de;
  }

  .subtitle{
    color: #F2F2F2;
    margin-left: -490px;
    background-color: red;   
  }

  .gameover h2,
  .gameover p {
    margin-bottom: 1rem;
    margin-left: -125px;
    font-size: 20px !important;
  }

  button{
    color: #D8BFD8;
    width: 250px;
    text-align: center;
    margin-left: -80px;
    margin-top: -2rem;
  }

  .gameover p {
    color: #8435de;
  }

  .imge {
    margin-top: 95px;
    height: 100px;
    margin-left: -160px;
  }

  .butto{
    margin-top: -431px;
    color: #D8BFD8;
    width: 250px;
    position: absolute;
    text-align: center;
    margin-left: 300px;
  }
  .button{
    margin-top: -331px;
    color: #D8BFD8;
    width: 250px;
    position: absolute;
    text-align: center;
    margin-left: 300px;
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
    max-width: 660px;
    height: 30px;
    display: flex;
    justify-content: space-between ;
  }

  .welcome, button {
   
    height: 50px;
  
  }


  .separar{
    width: 210px;
    height: 50px;
    text-align: center;
   
  }

  .fi{
    height: 50px;
    display:block;
  }

  .imge{
    text-align: center;
    margin-top: 7rem;
  }

  h2{
    height: 50px;
    margin-bottom: 1rem;
  }  

  .welcome p {
    height: 50px;
    margin-bottom: 1rem;
  }

  button{
    color: #D8BFD8;
  }
  .welcome p {
    color: #D8BFD8;
  }
`
export const PickCate= styled.div`
.category {
  margin-left: -150px;
    max-width: 600px;
    
  }

  .MuiInputLabel-root {
    font-size: 15px !important;
    padding-bottom: 15px !important;
  }
  
  .MuiInput-root {
    height: 15px !important;
  }

  .fac{
    font-size: 20px;
  }

  .settings_select {
    position: absolute;
    display: flex;
    flex-direction: column;
    padding: 15px;
    margin-top: 85px;
    width: 25%;
    height: 12%;
    flex: 0.8;
    margin-left: -280px;
    border-radius: 35px;
    border: solid 2px;
    border-color:  #8435de;
  }

  .category h2,
  .category p {
    margin-bottom: 1rem;
  }

  .category p {
    color: #D8BFD8;
  }

  .category imge {
    margin-top: 1rem;
    max-width: 300px;
  }

  .category button {
    margin: 1rem;
    color: #D8BFD8;
  }
`

export const Quest = styled.div`
.question {
    background-color: #8435de;
    border-radius: 1rem;
    padding: 2rem;
    width: 950px;
    height: 566px;
  }

  .subtitle{
    color: #F2F2F2;
    margin-left: -690px;   
  }

  .subtitle:hover {
    opacity: 1;
    color: #D8BFD8;;
  }

  .question p {
    margin-bottom: 1rem;
    color: #D8BFD8;
  }

  .question h2 {
    margin-bottom: 2rem;
     color: #D8BFD8;
  }

  .question button {
    border: 2px solid #fff;
    margin: 1rem;
    color: #D8BFD8;
  }
`
