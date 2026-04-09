import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import "../styles/Login.css";

type Props = {
    setToken: (token: string) => void;
};

export default function Login({ setToken }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("https://localhost:44372/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) throw new Error("Неверный логин или пароль");

            const data = await res.json();

            localStorage.setItem("token", data.token);
            setToken(data.token);

            alert("Вход успешен");

            navigate("/profile");

        } catch (err: any) {
            alert(err.message || "Ошибка входа");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Вход</h2>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                    <button type="submit" className="submit">Увійти</button>

                </form>

                <Link to="/register">
                    <button className="submit">Зареєструватись</button>
                </Link>

            </div>
        </div>
    );
}