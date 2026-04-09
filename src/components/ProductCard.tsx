import "../styles/Products-section.css";
import { useNavigate } from "react-router-dom";

type Props = {
    title: string;
    price: number;
    imageUrl: string;
    token: string | null;
};

export default function ProductCard({ title, price, imageUrl, token }: Props) {
    const navigate = useNavigate();

    const goToBuyPage = () => {
        if (!token) return;

        navigate("/buyproduct", {
            state: { title, price, imageUrl }
        });
    };

    return (
        <div className="product-card">
            <div className="product-img">
                <img src={imageUrl || "/images/placeholder.png"} alt={title} />
            </div>

            <h3>{title}</h3>
            <p>{price} грн</p>

            <button onClick={goToBuyPage} disabled={!token}>
                {token ? "Купити" : "Увійдіть щоб купити"}
            </button>
        </div>
    );
}