import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import Microphone from '../icons/microphone.png';
import UserIcon from '../icons/free-icon-user-4120345.png';
import Libra from "../icons/free-icon-libra-125501.png";
import Shopping from "../icons/free-icon-shopping-cart-711897.png";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import searchIcon from "../icons/search.png";

export default function Header() {
    const [token, setToken] = useState<string | null>(null);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        setToken(savedToken);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchText.trim()) return;

        navigate(`/searchresult?query=${encodeURIComponent(searchText.trim())}`);
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/backLeftSide">
                    <div className="burger">
                        <span></span>
                        <a></a>
                        <span></span>
                        <a></a>
                        <span></span>
                    </div>
                </Link>

                <Link to="/" className="logo">
                    <img src="https://content2.rozetka.com.ua/logo/site_dark_theme/original/559597231.svg"/>
                </Link>
            </div>

            <button className="button-catalog">
                <div className="catalog-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <h3>Каталог</h3>
            </button>

            <form className="search-form" onSubmit={handleSearch}>
                <button type="submit" className="search-button">
                    <img src={searchIcon} />
                </button>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Пошук товарів..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <img src={Microphone} alt="search"/>
                <button className="Find-button" type="submit">
                    <h2>Знайти</h2>
                </button>
            </form>

            <div className="header-buttons">
                {token ? (
                    <Link to="/profile">
                        <button>
                            <FaUserCircle size={28} color="#333" title="Профиль"/>
                        </button>
                    </Link>
                ) : (
                    <Link to="/login">
                        <button>
                            <img src={UserIcon} alt="Войти"/>
                        </button>
                    </Link>
                )}

                <button><img src={Libra} alt="Currency"/></button>

                <Link to="/shopping">
                    <button><img src={Shopping} alt="Корзина"/></button>
                </Link>
            </div>
        </header>
    );
}