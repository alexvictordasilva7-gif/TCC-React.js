import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard.jsx';
import Servicos from '../pages/Servicos.jsx';
import Clientes from '../pages/Clientes.jsx';
import Estoque from '../pages/Estoque.jsx';
import Financeiro from '../pages/Financeiro.jsx';

function Rotas(){
    return(
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/Dashboard" element={<Dashboard/>}/>
                <Route path="/Servicos" element={<Servicos/>}/>
           
            </Route>
        </Routes>
    );
};

export default Rotas;