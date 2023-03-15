import styled, { css } from 'styled-components';

interface BoxProps {
  width?: string;
  height?: string;
  bgColor?: string;
  display?: string;
  border?: string;
}

export const Box = styled.div<BoxProps>`

    .ranki{
        background-color: rgb(123 45 235 / 95%);
        height: 55px;
        border-bottom: solid 2px;
        border-bottom-color: black;
        font: bold;
        color: white;
        border-bottom:  3px;
        margin-top:  -13px;
    }

    h3{
      color: darkgray;
    }

    .pontua{
        display: flex;
        justify-content: space-between;
        padding-inline: 40px;
        padding-block-start: 20px;
        border-bottom: solid 3px;
        border-bottom-color: black;
        padding-bottom: 10px;
        font-weight: bold;
        color: darkgray;
    }

    .melhor{
      color: darkgray;
        font-family: Fascinate Inline;
        font-size: 20px;
        font-weight: 400;
        padding-left: 10px;
        padding-right: 10px;
    }
    div .displa{
      display: none;
      
    }

    .emblemas{
      position: absolute;
      margin-left: -20%;
      width: 15%; 
      margin-top: -15%;
    }

    .ponto{
        display: flex;
        justify-content: space-between;
        padding-inline: 40px;
        padding-block-start: 20px;
        border-bottom: solid 1px;
        border-bottom-color: black;
        padding-bottom: 14px;
        font-weight: bold;
        color: darkslategrey;
      }

      .img{

      }

  ${({ width, height, bgColor, display, border }) => css`
    width: ${width || '100px'};
    height: ${height || '100px'};
    color: ${bgColor || 'blue'};
    display: ${display || 'flex'};
    border-color: ${border || 'black'};
  `}
`;


