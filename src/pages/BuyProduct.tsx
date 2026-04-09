import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/BuyProduct.css";

export default function BuyProduct() {
    const location = useLocation();
    const navigate = useNavigate();

    const { title, price, imageUrl } = location.state || {};

    const [quantity, setQuantity] = useState(1);

    const token = localStorage.getItem("token");

    const handleBuy = async () => {
        try {
            const res = await fetch("https://localhost:44372/api/orders/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productName: title,
                    quantity: quantity,
                    price: price
                }),
            });

            if (!res.ok) throw new Error("Ошибка заказа");

            const order = await res.json();

            navigate("/approved", {
                state: {
                    order,
                    product: { title, price, imageUrl },
                    quantity
                }
            });

        } catch (err) {
            alert("Ошибка создания заказа");
        }
    };

    return (
        <div className="buy-container">

            <div className="buy-card">

                <img src={imageUrl || "/images/placeholder.png"} alt={title} />

                <div className="buy-info">
                    <h2>{title}</h2>

                    <p className="price">{price} грн</p>

                    <div className="quantity">
                        <label>Количество</label>

                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    <button className="buy-button" onClick={handleBuy}>
                        Подтвердить покупку
                    </button>

                </div>

            </div>

        </div>
    );
}