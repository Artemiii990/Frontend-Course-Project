import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {

    const navigate = useNavigate();

    const categories = [
        { name: "Ноутбуки та комп'ютери", slug: "laptops" },
        { name: "Смартфони, ТВ і електроніка", slug: "electronics" },
        { name: "Товари для геймерів", slug: "gaming" },
        { name: "Побутова техніка", slug: "home-appliances" },
        { name: "Товари для дому", slug: "home-goods" },
        { name: "Авто і мото", slug: "auto-moto" },
        { name: "Інструменти та обладнання", slug: "tools" },
        { name: "Сантехніка та ремонт", slug: "plumbing-repair" },
        { name: "Дача, сад і город", slug: "garden" },
        { name: "Спорт і захоплення", slug: "sports-hobbies" },
        { name: "Одяг, взуття та прикраси", slug: "clothing-shoes-jewelry" },
        { name: "Краса та здоров'я", slug: "beauty-health" },
        { name: "Дитячі товари", slug: "kids" },
        { name: "Зоотовар", slug: "pets" },
        { name: "Офіс, школа, книги", slug: "office-books" },
        { name: "Алкогольні напої та продукти", slug: "food-drinks" },
        { name: "Побутова хімія", slug: "cleaning-products" },
        { name: "Енергонезалежність", slug: "energy" },
        { name: "Подарунки та сувеніри", slug: "gifts" },
    ];

    const handleClick = (slug: string) => {
        navigate(`/category/${slug}`);
    };

    return (
        <div className="sidebar">

            <ul className="ul-list">

                {categories.map((cat, index) => (
                    <li
                        key={index}
                        className="li-list"
                        onClick={() => handleClick(cat.slug)}
                        style={{ cursor: "pointer" }}
                    >
                        {cat.name}
                    </li>
                ))}

            </ul>

        </div>
    );
}