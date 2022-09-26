import styled, { css } from 'styled-components';

interface BoxProps {
  width?: string;
  height?: string;
  bgColor?: string;
  display?: string;
  border?: string;
}

export const Box = styled.div<BoxProps>`
  ${({ width, height, bgColor, display, border }) => css`
    width: ${width || '100px'};
    height: ${height || '100px'};
    color: ${bgColor || 'blue'};
    display: ${display || 'flex'};
    border-color: ${border || 'black'};
  `}
`;


