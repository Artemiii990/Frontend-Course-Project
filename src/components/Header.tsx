import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import UserIcon from "../icons/user.svg";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import searchIcon from "../icons/search.png";
import KosicIcon from "../icons/basket.svg"

export default function Header() {

    const [token, setToken] = useState<string | null>(null);
    const [searchText, setSearchText] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const savedToken = localStorage.getItem("token");
        setToken(savedToken);

    }, []);

    const handleSearch = (e: React.FormEvent) => {

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
                        <span></span>
                        <span></span>

                    </div>

                </Link>

                <Link to="/" className="logo">

                    <img
                        src="https://content2.rozetka.com.ua/logo/site_dark_theme/original/559597231.svg"
                        alt="logo"
                    />

                </Link>

            </div>

            <form className="search-form" onSubmit={handleSearch}>

                <button type="submit" className="search-button">

                    <img src={searchIcon} alt="search"/>

                </button>

                <input
                    type="text"
                    className="search-input"
                    placeholder="Пошук товарів..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <button className="Find-button" type="submit">
                    <h2>Знайти</h2>
                </button>

            </form>

            <div className="header-buttons">

                {token ? (
                    <>
                        <Link to="/kosik">
                            <button >
                                <img src={KosicIcon} alt="Увійти"/>
                            </button>
                        </Link>

                        <Link to="/profile">
                            <button>
                                <FaUserCircle
                                    size={28}
                                    color="#333"
                                    title="Профіль"
                                />
                            </button>
                        </Link>
                    </>
                ) : (
                    <Link to="/login">
                        <button>
                            <img src={UserIcon} alt="Увійти"/>
                        </button>
                    </Link>
                )}

            </div>

        </header>
    );
}