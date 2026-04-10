import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/backLeftSide.css";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const checkAdmin = async () => {
            if (!token) return;

            try {
                const res = await fetch(
                    "https://localhost:44372/api/Auth/checkAdmin",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setIsAdmin(res.ok);
            } catch {
                setIsAdmin(false);
            }
        };

        checkAdmin();
    }, []);

    return (
        <>
            <div className={`LeftSidebar ${isOpen ? "open" : ""}`}>
                <h3>
                    <img src="https://content2.rozetka.com.ua/logo/site_dark_theme/original/559597231.svg"/>
                </h3>

                <ul>

                    {/*  Админ видит только админ */}
                    {isAdmin && (
                        <li>
                            <Link to="/admin">Адмін-Панель</Link>
                        </li>
                    )}

                    <li>
                        <Link to="/profile">Ваші замовлення/Профіль</Link>
                    </li>
                    <li>
                        <Link to="/kosik">Кошик</Link>
                    </li>

                </ul>
            </div>

            {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </>
    );
}