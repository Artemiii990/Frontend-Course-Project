import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/backLeftSide.css";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>

            {/* Sidebar */}
            <div className={`LeftSidebar ${isOpen ? "open" : ""}`}>
                <h3>Админ-панель</h3>
                <ul>
                    <li><Link to="/admin">Главная</Link></li>
                    <li><Link to="/approved">Утверждение товаров</Link></li>
                    <li><Link to="/orders">Заказы</Link></li>
                    <li><Link to="/products">Продукты</Link></li>
                    <li><Link to="/profile">Профиль</Link></li>
                </ul>
            </div>

            {/* Overlay для закрытия при клике вне панели */}
            {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </>
    );
}