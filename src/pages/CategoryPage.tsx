import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/CategoryPage.css"

type Product = {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
};

export default function CategoryPage() {

    const { slug } = useParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {

        if (!slug) return;

        fetch(`https://localhost:44372/api/FindProduct/category/${slug}`)
            .then(res => res.json())
            .then(data => setProducts(data));

    }, [slug]);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / itemsPerPage)
    );

    const startIndex = (page - 1) * itemsPerPage;

    const paginated = filtered.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <div className="category-page">

            <h2>{slug}</h2>

            <input
                type="text"
                placeholder="Пошук товарів..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />

            <div className="product-grid-category">

                {paginated.map(p => (
                    <div key={p.id} className="product-card-category">

                        <img src={p.imageUrl} />

                        <h3>{p.name}</h3>

                        <p>{p.price} грн</p>

                    </div>
                ))}

            </div>

            <div className="pagination">

                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    ←
                </button>

                <span>{page} / {totalPages}</span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    →
                </button>

            </div>

        </div>
    );
}