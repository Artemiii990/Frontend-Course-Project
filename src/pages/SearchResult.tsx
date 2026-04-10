import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/SearchResult.css";
import type { Product } from "../Type/TypeProduct.ts";

export default function SearchResults() {
    const [products, setProducts] = useState<Product[]>([]);

    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query") || "";

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [search, setSearch] = useState("");

    const [sortType, setSortType] = useState("default");

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch(
                `https://localhost:44372/api/FindProduct?search=${encodeURIComponent(query)}`
            );

            const data = await res.json();
            setProducts(data);
        };

        if (query) fetchProducts();
    }, [query]);

    const filteredProducts = products.filter((p) => {
        const price = p.price;
        const name = p.name.toLowerCase();
        const querySearch = search.toLowerCase();

        if (querySearch && !name.includes(querySearch)) return false;

        if (minPrice && price < Number(minPrice)) return false;
        if (maxPrice && price > Number(maxPrice)) return false;

        return true;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortType === "price_asc") return a.price - b.price;
        if (sortType === "price_desc") return b.price - a.price;
        return 0;
    });

    return (
        <div className="search-page">

            {/* товары */}
            <div className="products-section">

                <h2>Результати пошуку: "{query}"</h2>

                {sortedProducts.length === 0 ? (
                    <p className="no-results">Нічого не знайдено</p>
                ) : (
                    <div className="products-grid">

                        {sortedProducts.map((p) => (
                            <div className="product-card-result" key={p.id}>

                                <img src={p.imageUrl} alt={p.name} />

                                <h3>{p.name}</h3>

                                <p className="price">{p.price} грн</p>

                                <Link to="/approved">
                                    <button className="submit-buy-find">
                                        Купити
                                    </button>
                                </Link>

                            </div>
                        ))}

                    </div>
                )}

            </div>

            {/* панель фильтров */}
            <div className="filter-panel">

                <h3>Фильтры</h3>

                {/* поиск */}
                <div className="filter-block">
                    <label>Пошук за назвою</label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* цена */}
                <div className="filter-block">

                    <label>Ціна</label>

                    <input
                        type="number"
                        placeholder="от"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="до"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />

                </div>

                {/* сортировка */}
                <div className="filter-block">

                    <label>Сортування</label>

                    <select
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                    >

                        <option value="default">Без сортування</option>
                        <option value="price_asc">Спочатку дешевші</option>
                        <option value="price_desc">Спочатку дорожчі</option>

                    </select>

                </div>

            </div>

        </div>
    );
}