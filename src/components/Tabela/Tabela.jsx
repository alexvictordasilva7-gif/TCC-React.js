
import * as S from './Tabela.Styled';

function Tabela({ colunas, dados, renderLinha }) {
  return (
    <S.TabelaCaixa $colunas={colunas.length}>
      {colunas.map((coluna, i) => (
        <S.Celula $cabecalho key={`h-${i}`}>{coluna}</S.Celula>
      ))}

      {dados.map((item, index) => (
        renderLinha(item, index)
      ))}
    </S.TabelaCaixa>
  );
}

export default Tabela;