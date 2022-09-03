import styled, { css } from 'styled-components'
import { rgba, darken, shade } from 'polished'
import { Form } from '@unform/web'

import { Button } from '../../../components/Button'
import EmblemOuro from '../../../assets/illustrations/ouro.svg';
import EmblemPrata from '../../../assets/illustrations/prata.svg';
import EmblemBronze from '../../../assets/illustrations/bronze.svg';
import {
    Email,
    User,
    UserAlt,
    Eye,
    Trash,
    Download,
    Share,
    Close,
    Lock,
    LockAlt
} from '../../Icons'

const actButtonVariation = {
    blue: css`
        background: ${props => props.theme.colors.blue};

        :hover {
            background: ${props => shade(0.15, props.theme.colors.blue)};
        }
    `,
    red: css`
        background: ${props => props.theme.colors.red};
        :hover {
            background: ${props => shade(0.15, props.theme.colors.red)};
        }
    `
}

export const EmblemGold = styled(Object(EmblemOuro))`
    width: 30%;
    height: auto;

    h3{
        margin-top: 0%;
    }

    @media screen and (max-width: 540px) {
        display: none;
    }
`;

export const EmblemSilver = styled(Object(EmblemPrata))`
    width: 30%;
    height: auto;

    @media screen and (max-width: 540px) {
        display: none;
    }
`;

export const EmblemBronzi = styled(Object(EmblemBronze))`
    width: 30%;
    height: auto;

    @media screen and (max-width: 540px) {
        display: none;
    }
`;


export const Container = styled.div`
    height: 100%;
    display: block;
    overflow: auto;

    background: ${props => props.theme.colors.background};
    padding: 2.4rem;
    /* overflow: auto; */

    strong, h1, h2, h3 {
        color: ${props => props.theme.colors.title};
    }
`




export const Paper = styled.div`
    background: ${props => props.theme.colors.paper};
    width: min(964px, 90%);
    height: fit-content;
    border-radius: 8px;
    position: relative;
    /* box-shadow: 0px 0px 50px 18px rgba(0,0,0,0.1); */


    .msg{
        text-align: center;
    }
    .emblem{
        text-align: center;
    }
    padding: 2.4rem;
    margin: auto;
    /* margin-top: 4rem; */

    & + div {
        margin-top: 3.2rem;
    }
`

export const PseudoInput = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    background: ${props => darken(0.045, props.theme.colors.paper)};
    border-radius: 8px;

    & + div {
        margin-top: 1.2rem;
    }

    span {
        width: 9rem;
        display: flex;
        justify-content: center;
        border-radius: 8px 0 0 8px;
        background: ${props => props.theme.colors.background};

        color: ${props => props.theme.colors.title};
        font-weight: 600;

        border: solid 1px ${props => rgba(props.theme.colors.text, 0.15)};
        padding: .8rem 0;
        margin-right: 1.2rem;
    }
`

export const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(264px, 1fr));
    /* grid-template-columns: repeat(auto-fit, minmax(364px, 1fr)); */
    grid-gap: 1.6rem;

    /* width: 90%; */
    height: fit-content;
    margin: auto;

    /* padding: 2.4rem; */
    margin-top: 4rem;
`

export const StButton = styled(Button) <{ toRight?: boolean }>`
    width: fit-content;
    height: fit-content;
    border-radius: 4px;

    padding: 1rem 2.4rem;
    font-size: 2rem;
    font-weight: 900;

    margin-top: 2.4rem;

    ${props => !props.color && css`
        background: ${props.theme.colors.primary};

        :hover {
            background: ${shade(0.1, props.theme.colors.primary)} !important;
        }
    `}

    ${props => props.toRight && css`
        margin-left: auto;
    `}
`

export const StForm = styled(Form)`
    & > fieldset {
        h3 {
            margin-bottom: .8rem;

            padding: 15px;
        }

        h2{
            text-align: center;
        }

        + fieldset {
            margin-top: 1.6rem;
        }

        label {
            display: block;
            margin-bottom: .4rem;
        }
    }
`

export const FormGroup = styled.div<{ mult?: boolean }>`
    + div {
        margin-top: 1.2rem;
    }

    label {
        display: block;
        margin-bottom: .4rem;
    }


    ${props => props.mult && css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
        grid-gap: 2rem;

        @media screen and (max-width: 490px) {
            grid-template-columns: 1fr;
            grid-gap: .8rem;
        }
    `}

`


export const FormGroup2 = styled.div<{ mult?: boolean }>`
    + div {
        margin-top: 1.2rem;
    }

    label {
        display: block;
        margin-bottom: .4rem;
    }


    ${props => props.mult && css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
        grid-gap: 2rem;

        @media screen and (max-width: 490px) {
            grid-template-columns: 1fr;
            grid-gap: .8rem;
        }
    `}

`

export const FormInputContainer = styled.div<{ gridColumn?: string }>`
    grid-column: ${props => props.gridColumn ? props.gridColumn : 'auto'};

    .flex-container{
        display: flex;
        justify-content: space-evenly;
        padding-top: 10px;

    }

    .vtt{
       text-align:center;
    }

    @media screen and (max-width: 490px) {
        grid-column: auto;
    }
`

export const ActionButtonContainer = styled.div``
export const ActButton = styled.button<{ colorType: "red" | "blue" }>`
    padding: 0.4rem;
    border-radius: .4rem;
    background: ${props => props.theme.colors.red};

    font-size: 0;
    color: white;

    & + button {
        margin-left: .8rem;
    }

    :hover {
        background: ${props => shade(0.15, props.theme.colors.red)};
    }

    ${props => actButtonVariation[props.colorType]}
`

export const Copy = styled.span`
    display: block;
    width: fit-content;
    margin: 2.4rem auto 0;
`

export const ModalContainer = styled.div`
    background: ${props => props.theme.colors.paper};
    padding: 2.4rem;
    border-radius: 8px;
    position: relative;

    width: min(600px, 100%);
    margin: 6.4rem auto auto;

    a {
        color: ${props => props.theme.colors.primary};
    }

    h3 {
        margin-bottom: .8rem;
    }
    h2 {
        margin-bottom: 1rem;
    }
`
export const ModalGridRow = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(224px, 1fr));
    grid-gap: 1.6rem;

    + div {
        margin-top: 2.4rem;
    }
`

export const ModalCloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;

    :hover {
        opacity: .5;
    }
`

export const ModalSubItem = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    /* margin-left: 2.4rem; */
`

const ModalIconCss = css`
    width: 2.4rem;
    height: 2.4rem;

    margin-right: 1rem;
`

const IconCss = css`
    width: 2rem;
    height: 2rem;

    margin-right: 1rem;
`

export const StEmail = styled(Email)`
    ${IconCss}
`
export const StUser = styled(User)`
    ${IconCss}
`
export const StUserAlt = styled(UserAlt)`
    ${IconCss}
`
export const StPassword = styled(Lock)`
    ${IconCss}
`
export const StPasswordAlt = styled(LockAlt)`
    ${IconCss}
`


export const StDownLoad = styled(Download)`
    ${ModalIconCss}
    color: ${props => props.theme.colors.primary};
`
export const StShare = styled(Share)`
    width: 2rem;
    height: 2rem;

    margin-right: 1rem;
`
export const StClose = styled(Close)`
    ${ModalIconCss}
`

export const StEye = styled(Eye)`
    width: 2rem;
    height: 2rem;
`
export const StTrash = styled(Trash)`
    width: 2rem;
    height: 2rem;
`
export const StTrashEmble = styled(Trash)`
    width: 5rem;
    height: 5rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
    cursor: pointer;
`

export const StatusFlag = styled.div<{
    colorType: "red" | "green" | "blue"
}>`
    background: ${props => props.theme.colors[props.colorType]};
    border-radius: 8px;
    color: white;
    font-weight: bold;

    padding: 1rem 0;
    width: 10rem;
    display: flex;
    justify-content: center;
`

interface FlexProps {
    /* activate flexbox for top element */
    container?: boolean;
    alignItems?:
      | 'stretch'
      | 'center'
      | 'flex-start'
      | 'flex-end'
      | 'baseline'
      | 'initial'
      | 'inherit';
    justifyContent?:
      | 'flex-start'
      | 'flex-end'
      | 'space-between'
      | 'space-around'
      | 'center'
      | 'initial'
      | 'inherit';
    direction?: 'column' | 'row';
    flexWrap?: 'wrap' | 'nowrap' | 'reverse';
    height?: string;
    maxHeight?: string;
    width?: string;
    maxWidth?: string;
    alignSelf?: 'stretch' | 'center' | 'start' | 'end';
    justifySelf?: 'stretch' | 'center' | 'start' | 'end';
    bgColor?: string;
    flex?: string;
    flexBasis?: string;
    flexGrow?: number;
    flexShrink?: number;

    /* padding and margin */
    padding?: number | number[];
    margin?: number | number[];

    pushDown?: boolean;
    pushLeft?: boolean;
    pushRight?: boolean;
    pushTop?: boolean;
  }

  export const Flex = styled.div<FlexProps>`
    ${({
      container,
      alignItems,
      justifyContent,
      direction,
      flexWrap,
      height,
      maxHeight,
      bgColor,
      flex,
      flexBasis,
      flexGrow,
      flexShrink,
      width,
      maxWidth,
      padding,
      margin,
      justifySelf,
      alignSelf,
      pushDown,
      pushLeft,
      pushRight,
      pushTop,
    }) => css`
      display: ${container ? 'flex' : 'block'};
      ${justifyContent &&
      css`
        justify-content: ${justifyContent};
      `}
      ${alignItems &&
      css`
        align-items: ${alignItems};
      `}
        ${direction &&
      css`
        flex-direction: ${direction};
      `}
      ${flexWrap &&
      css`
        flex-wrap: ${flexWrap};
      `}
      ${height &&
      css`
        height: ${height};
      `}
      ${maxHeight &&
      css`
        max-height: ${maxHeight};
      `}
      ${width &&
      css`
        width: ${width};
      `}
      ${maxWidth &&
      css`
        max-width: ${maxWidth};
      `}
      ${bgColor &&
      css`
        background-color: ${bgColor};
      `}
      /* additional flex properties */
      ${flex &&
      css`
        flex: ${flex};
      `}
      ${flexGrow &&
      css`
        flex-grow: ${flexGrow};
      `}
      ${flexShrink &&
      css`
        flex-shrink: ${flexShrink};
      `}
      ${flexBasis &&
      css`
        flex-basis: ${flexBasis};
      `}
      ${alignSelf &&
      css`
        align-self: ${alignSelf};
      `}
      ${justifySelf &&
      css`
        justify-self: ${justifySelf};
      `}
      ${handleMarginOrPadding(margin)}
      ${handleMarginOrPadding(padding, true)}
      ${pushDown &&
      css`
        margin-top: auto;
      `}
      ${pushTop &&
      css`
        margin-bottom: auto;
      `}
      ${pushLeft &&
      css`
        margin-right: auto;
      `}
      ${pushRight &&
      css`
        margin-left: auto;
      `}
    `}
  `;

  const handleMarginOrPadding = (
    values?: number | number[],
    isPadding?: boolean
  ) => {
    if (!values) return;

    if (Array.isArray(values)) {
      if (values.length > 4) {
        throw new Error(`${isPadding ? 'Padding' : 'Margin'} can have 4 values`);
      }

      // [1, 2] => '1rem 2rem'
      const convertValuesArrayToString = values
        .map((v) => (v === 0 ? 0 : `${v}rem`))
        .join(' ');

      if (isPadding) {
        return css`
          padding: ${convertValuesArrayToString};
        `;
      }

      return css`
        margin: ${convertValuesArrayToString};
      `;
    }

    if (isPadding) {
      return css`
        padding: ${values}rem;
      `;
    }

    return css`
      margin: ${values}rem;
    `;
  };

