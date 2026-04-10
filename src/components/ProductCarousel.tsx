import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import ProductCard from "./ProductCard"
import "../styles/Products-section.css"

type Product = {
    id: number
    name: string
    price: number
    imageUrl: string
}

type Props = {
    products: Product[]
    token: string | null
}

export default function ProductCarousel({ products, token }: Props) {
    return (
        <div className="ProductCarousel">
            <div className="swiper-button-prev"></div>

            <Swiper
                modules={[Navigation]}
                navigation={{
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next",
                }}
                spaceBetween={20}
                slidesPerView={4}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1400: { slidesPerView: 4 },
                }}
            >
                {products.map((p) => (
                    <SwiperSlide key={p.id}>
                        <ProductCard
                            key={p.id}
                            id={p.id}
                            title={p.name}
                            price={p.price}
                            imageUrl={p.imageUrl}
                            token={token}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="swiper-button-next"></div>
        </div>
    )
}