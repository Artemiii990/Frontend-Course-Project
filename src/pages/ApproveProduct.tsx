import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ApproveProduct.css";

export default function Approved() {
    const location = useLocation();
    const navigate = useNavigate();

    const { product, quantity } = location.state || {};

    if (!product) {
        return <p>Нет данных о заказе</p>;
    }

    return (
        <div className="approved-overlay">

            <div className="approved-modal">

                <h2 className="approved-title">
                    Заказ успешно оформлен!
                </h2>

                <img
                    className="approved-image"
                    src={product.imageUrl}
                    alt={product.title}
                />

                <h3 className="approved-product">
                    {product.title}
                </h3>

                <p className="approved-info">
                    Количество: <b>{quantity}</b>
                </p>

                <p className="approved-info">
                    Цена: <b>{product.price} грн</b>
                </p>

                <button
                    className="approved-button"
                    onClick={() => navigate("/")}
                >
                    Вернуться в магазин
                </button>

            </div>

        </div>
    );
}