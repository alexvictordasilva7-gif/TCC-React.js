import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import Servicos from '../pages/Servicos/Servicos.jsx';
import Clientes from '../pages/Clientes/Clientes.jsx';
import Estoque from '../pages/Estoque/Estoque.jsx';
import Financeiro from '../pages/Financeiro/Financeiro.jsx';

function Rotas(){
    return(
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/Dashboard" element={<Dashboard/>}/>
                <Route path="/Servicos" element={<Servicos/>}/>
                <Route path="/Clientes" element={<Clientes/>}/>
           
            </Route>
        </Routes>
    );
};

export default Rotas;