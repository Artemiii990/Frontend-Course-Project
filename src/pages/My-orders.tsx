import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

type Order = {
    id: number;
    productName: string;
    quantity: number;
    price: number;
    date: string;
    status: string;
};

export default function MyOrders() {

    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const fetchOrders = async () => {

        const res = await fetch(
            "https://localhost:44372/api/orders/myorders",
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const data = await res.json();
        setOrders(data);
    };

    useEffect(() => {

        if (!token) {
            navigate("/login");
            return;
        }

        fetchOrders();

    }, []);

    const cancelOrder = async (orderId: number) => {

        if (!confirm("Скасувати замовлення?")) return;

        await fetch(
            `https://localhost:44372/api/orders/${orderId}/cancel`,
            {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        fetchOrders();
    };

    return (
        <div className="profile-page">

            <div className="profile-container">

                <h2>Мої замовлення</h2>

                <table>

                    <thead>

                    <tr>
                        <th>№</th>
                        <th>Товар</th>
                        <th>Кіл-сть</th>
                        <th>Ціна</th>
                        <th>Дата</th>
                        <th>Статус</th>
                        <th>Дія</th>
                    </tr>

                    </thead>

                    <tbody>

                    {orders.map((order, index) => (

                        <tr key={order.id}>

                            <td>{index + 1}</td>

                            <td>{order.productName}</td>

                            <td>{order.quantity}</td>

                            <td>{order.price} грн</td>

                            <td>
                                {new Date(order.date).toLocaleDateString()}
                            </td>

                            <td>
                                <span className={`status ${order.status}`}>
                                    {order.status}
                                </span>
                            </td>

                            <td>

                                {order.status === "Processing" && (

                                    <button
                                        onClick={() => cancelOrder(order.id)}
                                    >
                                        Скасувати
                                    </button>

                                )}

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}