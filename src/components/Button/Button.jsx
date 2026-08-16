

import { BotaoE } from './Button.Styled.jsx';

function Botao({filho, onClick, $cor, tamanho, $tcor, type}) {
    return (
        <BotaoE type={type} $tcor={$tcor} onClick={onClick} $cor={$cor} tamanho={tamanho}>
            {filho}
        </BotaoE>
    );
}

export default Botao;