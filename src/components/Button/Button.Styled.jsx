import styled from 'styled-components';

export const BotaoE = styled.button`
    background-color: ${$props => $props.$cor || 'blue'};
    font-size: ${props => props.fsize || '16px'};
    color: ${$props => $props.$tcor || '#fff'};
    width: ${$props => $props.ltamanho };
    height: ${$props => $props.atamanho };
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.3s;

    &:hover{
        opacity: 0.7;
    }

    &:active {
        transform: scale(0.80);
    }
`;
