import { render, screen, fireEvent } from "@testing-library/react";
import { Login } from "./index";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login Component", () => {
  test("exibe mensagem de erro ao inserir CPF inválido", () => {
    renderWithRouter(<Login />);
    const cpfInput = screen.getByPlaceholderText(/insira seu e-mail ou CPF/i);

    fireEvent.change(cpfInput, { target: { value: "12345678900" } });

    const errorMessage = screen.getByText(/CPF inválido/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("alterna a visibilidade da senha ao clicar no botão", () => {
    renderWithRouter(<Login />);
    const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);
    const toggleButton = screen.getByRole("button", { name: /mostrar senha/i });

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("botão de login é desabilitado se o formulário estiver incompleto ou inválido", () => {
    renderWithRouter(<Login />);
    const cpfInput = screen.getByPlaceholderText(/insira seu e-mail ou CPF/i);
    const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);
    const loginButton = screen.getByRole("button", { name: /continuar/i });

    // CPF inválido, senha vazia
    fireEvent.change(cpfInput, { target: { value: "123.456.789-09" } });
    fireEvent.change(passwordInput, { target: { value: "" } });
    expect(loginButton).toBeDisabled();

    // CPF válido, senha vazia
    fireEvent.change(cpfInput, { target: { value: "111.444.777-35" } });
    expect(loginButton).toBeDisabled();

    // CPF válido, senha preenchida
    fireEvent.change(passwordInput, { target: { value: "senha123" } });
    expect(loginButton).not.toBeDisabled();
  });
});
