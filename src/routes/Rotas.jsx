import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import Servicos from '../pages/Servicos/Servicos.jsx';
import Clientes from '../pages/Clientes/Clientes.jsx';
import Pets from '../pages/Pets/Pets.jsx';
import Login from '../pages/login/login.jsx'
import Cadastro from '../pages/Cadastro/Cadastro.jsx'
import Estoque from '../pages/Estoque/Estoque.jsx';
import Fornecedor from '../pages/Fornecedor/Fornecedor.jsx';
import Financeiro from '../pages/Financeiro/Financeiro.jsx';

function Rotas(){
    return(
        <Routes>
            <Route>
                <Route path="/" element={<Navigate to='/Login' replace />}/>
                <Route path="/Login" element={<Login/>}/>
                <Route path="/Cadastro" element={<Cadastro/>}/>
            </Route>
            <Route element={<Layout/>}>
                <Route path="/Dashboard" element={<Dashboard/>}/>
                <Route path="/Servicos" element={<Servicos/>}/>
                <Route path="/Clientes" element={<Clientes/>}/>
                <Route path='/Pets' element={<Pets/>}/>
                <Route path='/Estoque' element={<Estoque/>}/>
                <Route path='/Fornecedor' element={<Fornecedor/>}/>
                
            </Route>
        </Routes>
    );
};

export default Rotas;