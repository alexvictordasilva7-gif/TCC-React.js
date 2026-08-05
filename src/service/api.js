import { useState, useEffect } from 'react';

function ListaDeUsuario() {
  const [usuario, setUsuario] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    // Criamos uma função assíncrona dentro do useEffect
    const buscarDados = async () => {
      try {
        // Coloque aqui a porta exata onde sua API do pendrive está rodando
        const resposta = await fetch('http://localhost:3333/user'); 
        
        if (!resposta.ok) {
          throw new Error('Erro ao buscaro s dados da API.');
        }

        const dados = await resposta.json();
        setUsuario(dados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false); // Executa sempre, dando certo ou errado
      }
    };

    buscarDados();
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;

  return (
    <ul>
      {usuario.map((usuario) => (
        <li key={usuario.id}>{usuario.name}</li>
      ))}
    </ul>
  );
}

export default ListaDeUsuario;