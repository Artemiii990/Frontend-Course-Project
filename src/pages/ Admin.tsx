import { useEffect, useMemo, useState } from "react";
import Pagination from "@mui/material/Pagination";
import "../styles/AdminPanel.css";

type Product = {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    categorySlug?: string;
};

type Order = {
    id: number;
    userId: string;
    productName: string;
    quantity: number;
    price: number;
    date: string;
    status: string;
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

    const [activeTab, setActiveTab] =
        useState<"products" | "orders" | "users">("products");

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [categorySlug, setCategorySlug] = useState("");

    const token = localStorage.getItem("token");

    const [productSearch, setProductSearch] = useState("");
    const [productPage, setProductPage] = useState(1);
    const itemsPerPage = 8;

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

    const getProducts = async () => {
        const res = await fetch(
            "https://localhost:44372/api/Products",
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        setProducts(await res.json());
    };

    const getOrders = async () => {
        const res = await fetch(
            "https://localhost:44372/api/orders/all",
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        setOrders(await res.json());
    };

    const getUsers = async () => {
        const res = await fetch(
            "https://localhost:44372/api/Orders/all-users",
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        setUsers(await res.json());
    };

    useEffect(() => {
        if (isAdmin) {
            getProducts();
            getOrders();
            getUsers();
        }
    }, [isAdmin]);

    // ✅ UPDATED ADD PRODUCT
    const addProduct = async (e: any) => {
        e.preventDefault();

        if (!name || !price || !imageUrl || !categorySlug) {
            alert("Заповніть всі поля");
            return;
        }

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
                    imageUrl,
                    categorySlug
                })
            }
        );

        if (!res.ok) return;

        setName("");
        setPrice("");
        setImageUrl("");
        setCategorySlug("");

        getProducts();
    };

    const deleteProduct = async (id: number) => {
        if (!confirm("Видалити товар?")) return;

        await fetch(
            `https://localhost:44372/api/Products/${id}`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        getProducts();
    };

    const updateOrderStatus = async (orderId: number, status: string) => {
        await fetch(
            `https://localhost:44372/api/orders/${orderId}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            }
        );

        getOrders();
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p) =>
            p.name.toLowerCase().includes(productSearch.toLowerCase())
        );
    }, [products, productSearch]);

    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginatedProducts = useMemo(() => {
        return filteredProducts.slice(
            (productPage - 1) * itemsPerPage,
            productPage * itemsPerPage
        );
    }, [filteredProducts, productPage]);

    if (isAdmin === null) return <h2>Завантаження...</h2>;

    if (!isAdmin)
        return <div className="not-admin">Немає доступу до прав адміна</div>;

    return (
        <div className="admin-container">

            <h1>Адмін-панель</h1>

            <div className="admin-tabs">
                <button onClick={() => setActiveTab("products")}>Товари</button>
                <button onClick={() => setActiveTab("orders")}>Замовлення</button>
                <button onClick={() => setActiveTab("users")}>Користувачі</button>
            </div>

            {activeTab === "products" && (
                <>
                    {/* FORM */}
                    <form className="admin-form" onSubmit={addProduct}>

                        <input
                            placeholder="Назва товару"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            placeholder="Ціна"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <input
                            placeholder="Image URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />

                        <select
                            value={categorySlug}
                            onChange={(e) => setCategorySlug(e.target.value)}
                        >
                            <option value="">Оберіть категорію</option>
                            <option value="laptops">Ноутбуки</option>
                            <option value="smartphones">Смартфони</option>
                            <option value="electronics">Електроніка</option>
                            <option value="home-appliances">Побутова техніка</option>
                            <option value="gaming">Ігри</option>
                            <option value="tools">Інструменти</option>
                        </select>

                        <button>Додати товар</button>
                    </form>

                    <input
                        placeholder="Пошук товарів..."
                        value={productSearch}
                        onChange={(e) => {
                            setProductSearch(e.target.value);
                            setProductPage(1);
                        }}
                    />

                    {/* TABLE */}
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Назва</th>
                            <th>Ціна</th>
                            <th>Фото</th>
                            <th>Дія</th>
                        </tr>
                        </thead>

                        <tbody>
                        {paginatedProducts.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.name}</td>
                                <td>{p.price}</td>
                                <td>
                                    <img src={p.imageUrl} width="50" />
                                </td>
                                <td>
                                    <button
                                        className="submit"
                                        onClick={() => deleteProduct(p.id)}
                                    >
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <Pagination
                        count={pageCount}
                        page={productPage}
                        onChange={(_, value) => setProductPage(value)}
                    />
                </>
            )}

            {activeTab === "orders" && (
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Товар</th>
                        <th>Кількість</th>
                        <th>Ціна</th>
                        <th>Дата</th>
                        <th>Статус</th>
                    </tr>
                    </thead>

                    <tbody>
                    {orders.map((o) => (
                        <tr key={o.id}>
                            <td>{o.id}</td>
                            <td>{o.userId}</td>
                            <td>{o.productName}</td>
                            <td>{o.quantity}</td>
                            <td>{o.price}</td>
                            <td>{new Date(o.date).toLocaleDateString()}</td>
                            <td>
                                <select
                                    value={o.status}
                                    onChange={(e) =>
                                        updateOrderStatus(o.id, e.target.value)
                                    }
                                >
                                    <option value="Processing">Обробляється</option>
                                    <option value="Shipped">Відправлено</option>
                                    <option value="Delivered">Доставлено</option>
                                    <option value="Cancelled">Скасовано</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

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
                    {users.map((u) => (
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