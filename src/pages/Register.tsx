import { useState } from "react"
import "../styles/Register.css"

export default function Register() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (form.password !== form.confirmPassword) {
            setError("Паролі мають співпадати!")
            return
        }

        try {

            const response = await fetch("https://localhost:44372/api/Auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })
            })

            if (!response.ok) {
                setError("Помилка реєстрації")
                return
            }

            const data = await response.json()

            if (data.token) {
                localStorage.setItem("token", data.token)
            }

            setSuccess("Вас успішно зареєстровано!")
            setError("")

            setForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            })

            // редирект на главную
            setTimeout(() => {
                window.location.href = "/"
            }, 1500)

        } catch (err) {
            setError("Помилка підключення до сервера")
        }
    }

    return (
        <div className="register-page">
            <div className="register-container">
                <h2>Реєстрація</h2>

                <form onSubmit={handleSubmit}>

                    <label>Ім'я</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Пароль</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <label>підтвердити пароль</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    {error && <p style={{color:"red"}}>{error}</p>}
                    {success && <p style={{color:"green"}}>{success}</p>}

                    <button type="submit">
                        Зареєструватись
                    </button>

                </form>
            </div>
        </div>
    )
}