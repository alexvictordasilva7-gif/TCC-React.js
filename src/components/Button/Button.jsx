

import { BotaoE } from './Button.Styled.jsx';

function Botao({filho, onClick, $cor, fsize, $tcor, type, atamanho, ltamanho }) {
    return (
        <BotaoE type={type} $tcor={$tcor} onClick={onClick} $cor={$cor} fsize={fsize} atamanho={atamanho} ltamanho={ltamanho}>
            {filho}
        </BotaoE>
    );
}

export default Botao;