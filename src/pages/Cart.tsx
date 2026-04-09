import { useState } from "react";
import "../styles/Shopping.css";

type Product = {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
};

type Props = {
    initialProducts: Product[];
};

export default function CartSimple({ initialProducts }: Props) {
    const [cartItems, setCartItems] = useState(
        initialProducts.map((p) => ({ ...p, quantity: 1 }))
    );
    const [loading, setLoading] = useState(false);

    // Увеличение/уменьшение количества
    const updateQuantity = (id: number, delta: number) => {
        setCartItems((items) =>
            items.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    // Удаление товара из корзины
    const removeItem = (id: number) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    // Общая сумма
    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Отправка заказа на сервер
    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        setLoading(true);

        try {
            for (const item of cartItems) {
                const response = await fetch(
                    "https://localhost:44372/api/orders/create",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                            productName: item.name,
                            quantity: item.quantity,
                            price: item.price,
                        }),
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Ошибка при заказе:", errorText);
                    alert("Ошибка при оформлении заказа");
                    setLoading(false);
                    return;
                }
            }

            // Успешный заказ — очищаем корзину
            setCartItems([]);
            alert("Заказ успешно оформлен!");
        } catch (err) {
            console.error(err);
            alert("Ошибка при оформлении заказа");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h1>Корзина</h1>

            {cartItems.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <>
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "15px",
                                borderBottom: "1px solid #ddd",
                                paddingBottom: "10px",
                            }}
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                style={{ width: "60px", marginRight: "10px" }}
                            />
                            <div style={{ flex: 1 }}>
                                <div>{item.name}</div>
                                <div>{item.price} грн</div>
                            </div>
                            <div>
                                <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    disabled={loading}
                                >
                                    -
                                </button>
                                <span style={{ margin: "0 8px" }}>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    disabled={loading}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
                                style={{ marginLeft: "10px", color: "red" }}
                                disabled={loading}
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    <h2>Итого: {total} грн</h2>

                    <button
                        style={{
                            padding: "10px 20px",
                            background: "#00a046",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? "Оформляем..." : "Оформить заказ"}
                    </button>
                </>
            )}
        </div>
    );
}