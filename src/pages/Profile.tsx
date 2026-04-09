// Profile.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

type Order = {
    id: number;
    productName: string;
    quantity: number;
    price: number;
    date: string;
};

export default function Profile() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetch("https://localhost:44372/api/orders/myorders", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 401) navigate("/login");
                    const text = await res.text();
                    throw new Error(text || "Не удалось загрузить заказы");
                }
                return res.json();
            })
            .then((data: Order[]) => setOrders(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) return <p className="loading">Загрузка...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h2>Ваш профиль</h2>
                    <button onClick={handleLogout}>Выйти</button>
                </div>

                {orders.length === 0 ? (
                    <p className="no-orders">Вы ещё не сделали ни одного заказа.</p>
                ) : (
                    <div className="orders-list">
                        <table>
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>Товар</th>
                                <th>Кол-во</th>
                                <th>Цена</th>
                                <th>Дата</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order, index) => (
                                <tr key={order.id}>
                                    <td>{index + 1}</td>
                                    <td>{order.productName}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.price} грн</td>
                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}