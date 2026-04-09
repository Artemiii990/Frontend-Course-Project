import { useEffect, useState } from "react";
import "../styles/AdminPanel.css";

type Product = {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
};

type Order = {
    id: number;
    userId: string;
    productName: string;
    quantity: number;
    price: number;
    date: string;
};

type User = {
    id: string;
    email: string;
    userName: string;
};

export default function AdminPanel() {

    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [activeTab, setActiveTab] = useState<"products" | "orders" | "users">("products");

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const token = localStorage.getItem("token");

    // ============================
    // Проверка админа
    // ============================
    useEffect(() => {
        const checkAdmin = async () => {

            if (!token) {
                setIsAdmin(false);
                return;
            }

            try {

                const res = await fetch(
                    "https://localhost:44372/api/Auth/checkAdmin",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setIsAdmin(res.ok);

            } catch {
                setIsAdmin(false);
            }
        };

        checkAdmin();

    }, []);

    // ============================
    // Получение товаров
    // ============================
    const getProducts = async () => {

        try {

            const res = await fetch(
                "https://localhost:44372/api/Products",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();

            setProducts(data);

        } catch (err) {
            console.log(err);
        }
    };

    // ============================
    // Получение заказов
    // ============================
    const getOrders = async () => {

        try {

            const res = await fetch(
                "https://localhost:44372/api/orders/all",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();

            setOrders(data);

        } catch (err) {
            console.log(err);
        }
    };

    // ============================
    // Получение пользователей
    // ============================
    const getUsers = async () => {

        try {

            const res = await fetch(
                "https://localhost:44372/api/Orders/all-users",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();

            setUsers(data);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {

        if (isAdmin) {
            getProducts();
            getOrders();
            getUsers();
        }

    }, [isAdmin]);

    // ============================
    // Добавление товара
    // ============================
    const addProduct = async (e: any) => {

        e.preventDefault();

        try {

            const res = await fetch(
                "https://localhost:44372/api/Products",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        price: Number(price),
                        imageUrl
                    })
                }
            );

            if (!res.ok) throw new Error("Ошибка добавления");

            setName("");
            setPrice("");
            setImageUrl("");

            getProducts();

        } catch (err) {
            console.log(err);
        }
    };

    // ============================
    // Удаление товара
    // ============================
    const deleteProduct = async (id: number) => {

        if (!confirm("Удалить товар?")) return;

        try {

            const res = await fetch(
                `https://localhost:44372/api/Products/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!res.ok) throw new Error("Ошибка удаления");

            getProducts();

        } catch (err) {
            console.log(err);
        }
    };

    // ============================
    // UI
    // ============================

    if (isAdmin === null) return <h2>Загрузка...</h2>;

    if (!isAdmin)
        return <div className="not-admin">У вас нет доступа к админ-панели</div>;

    return (

        <div className="admin-container">

            <h1>Админ-панель</h1>

            {/* переключатель вкладок */}
            <div className="admin-tabs">

                <button
                    className={activeTab === "products" ? "active" : ""}
                    onClick={() => setActiveTab("products")}
                >
                    Товары
                </button>

                <button
                    className={activeTab === "orders" ? "active" : ""}
                    onClick={() => setActiveTab("orders")}
                >
                    Заказы
                </button>

                <button
                    className={activeTab === "users" ? "active" : ""}
                    onClick={() => setActiveTab("users")}
                >
                    Пользователи
                </button>

            </div>


            {/* ========================= */}
            {/* ТОВАРЫ */}
            {/* ========================= */}

            {activeTab === "products" && (

                <>
                    <form className="admin-form" onSubmit={addProduct}>

                        <input
                            type="text"
                            placeholder="Название"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Цена"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="URL изображения"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            required
                        />

                        <button type="submit">Добавить</button>

                    </form>

                    <table className="admin-table">

                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Изображение</th>
                            <th>Действия</th>
                        </tr>
                        </thead>

                        <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.name}</td>
                                <td>{p.price}</td>
                                <td>
                                    <img src={p.imageUrl} width="50"/>
                                </td>
                                <td>
                                    <button onClick={() => deleteProduct(p.id)}>
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>

                    </table>
                </>
            )}


            {/* ========================= */}
            {/* ЗАКАЗЫ */}
            {/* ========================= */}

            {activeTab === "orders" && (

                <table className="admin-table">

                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Товар</th>
                        <th>Количество</th>
                        <th>Цена</th>
                        <th>Дата</th>
                    </tr>
                    </thead>

                    <tbody>
                    {orders.map(o => (
                        <tr key={o.id}>
                            <td>{o.id}</td>
                            <td>{o.userId}</td>
                            <td>{o.productName}</td>
                            <td>{o.quantity}</td>
                            <td>{o.price}</td>
                            <td>{new Date(o.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>

                </table>

            )}


            {/* ========================= */}
            {/* ПОЛЬЗОВАТЕЛИ */}
            {/* ========================= */}

            {activeTab === "users" && (

                <table className="admin-table">

                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Username</th>
                    </tr>
                    </thead>

                    <tbody>

                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.email}</td>
                            <td>{u.userName}</td>
                        </tr>
                    ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}