import "./login.css"
import { Link } from "react-router-dom";

function Cadastro(){
    return(
        <div className="tela">
            <div className="login">
                <img src="https://cdn.mindminers.com/blog/uploads/2022/11/pets.png" alt="" />
                <h1>Pet Shop</h1>
                <p>Sistema de gerenciamento</p>

                <form className="formInput">
                    <p>nome </p>
                    <input type="text" placeholder="Nome completo" />
                    <p>Email</p>
                    <input type="text" placeholder="Email"/>
                    <p>senha</p>
                    <input type="password" placeholder="Senha"/>
                    <div>
                        <a href="">esqueceu a senha</a>
                    </div>
                    <Link to="/">Fazer login</Link>
                </form>
            
            
            </div>
        </div>
    )
}

export default Cadastro;