import { useState, ChangeEvent } from "react";
import logoFullImage from "../../assets/logo-full.svg";
import arrowRightImage from "../../assets/arrow-right.svg";
import EyeIcon from "../../assets/eye-icon.svg";
import EyeIconClosed from "../../assets/eye-off-icon.svg";
import { useNavigate } from "react-router-dom"; 
import "./index.css";

function Login() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  const [cpfError, setCpfError] = useState("");
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:3000" || import.meta.env.VITE_BASE_URL;

  const handleChangeCPF = (e: ChangeEvent<HTMLInputElement>) => {
    const newCpf = e.target.value;
    setCpf(newCpf);
  
    if (newCpf && !isValidCPF(newCpf)) {
      setCpfError("CPF inválido");
    } else {
      setCpfError("");
    }
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleAuth = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf: cpf,
          password: password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const { token } = data;
  
        if (token) {
          localStorage.setItem("authToken", token);
          console.log("Token armazenado com sucesso:", token);
        } else {
          console.error("Token não encontrado na resposta da API");
        }
  
        navigate("/transactions");
      } else {
        console.error("Erro de autenticação");
        alert("Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro na requisição, tente novamente.");
    }
  };
  
  

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isValidCPF = (cpf: string) => {

    cpf = cpf.replace(/[^\d]+/g, "");
    
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.substring(10, 11));
  };

  const isFormValid = cpf.trim() !== "" && password.trim() !== "" && !cpfError && isValidCPF(cpf);

  return (
    <main className="login">
      <div className="login__logo-container">
        <img className="logo" src={logoFullImage} alt="Cora" title="Cora" />
      </div>
      <h1 className="login__title">Fazer LogIn</h1>
      <input
        className="login__input"
        id="cpf"
        placeholder="Insira seu e-mail ou CPF"
        onChange={handleChangeCPF}
      />
      {cpfError && <p className="error-message">{cpfError}</p>}
      <div className="login__input-container">
        <input
          className="login__input"
          id="password"
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Digite sua senha"
          onChange={handleChangePassword}
        />
        <button
          className="login__eye-button"
          type="button"
          onClick={togglePasswordVisibility} 
        >
          <img className="iconEye" src={isPasswordVisible ? EyeIcon : EyeIconClosed} alt="Mostrar senha" />
        </button>
      </div>
      <button
        className="login__button"
        onClick={handleAuth}
        disabled={!isFormValid} 
      >
        Continuar
        <img src={arrowRightImage} alt="Seta para a direita" />
      </button>
    </main>
  );
}

export { Login };
