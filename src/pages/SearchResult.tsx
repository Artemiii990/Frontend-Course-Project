import {Link, useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/SearchResult.css";

type Product = {
    id: number;
    title: string
    price: number;
    imageUrl: string;
};

export default function SearchResults() {
    const [products, setProducts] = useState<Product[]>([]);
    const location = useLocation();

    const query = new URLSearchParams(location.search).get("query") || "";

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch(`https://localhost:44372/api/FindProduct?search=${encodeURIComponent(query)}`);
            const data = await res.json();
            setProducts(data);
        };
        if (query) fetchProducts();
    }, [query]);

    return (
        <div className="search-results-container">
            <h2>Результаты поиска: "{query}"</h2>
            {products.length === 0 ? (
                <p className="no-results">Ничего не найдено</p>
            ) : (
                <div className="products-grid">
                    {products.map(p => (
                        <div className="product-card-result" key={p.id}>
                            <img src={p.imageUrl} alt={p.title} />
                            <h3>{p.title}</h3>
                            <p className="price">{p.price} грн</p>

                            <Link to="/approved">
                                <button className="submit-buy-find">Купити</button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}