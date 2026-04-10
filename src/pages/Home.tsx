import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import ProductCarousel from "../components/ProductCarousel"
import { getProducts } from "../Services/productsApi"
import ProductsForYou from "../components/ProductsForYou"
import type {Product} from "../Type/TypeProduct.ts";

type Props = {
    token: string | null
}

export default  function Home({ token }: Props) {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        (async () => {
            try {
                const data = await getProducts()
                setProducts(data)
            } catch (error) {
                console.error(error)
            }
        })()
    }, [])


    return (
        <div className="layout">
            <Sidebar />

            <div className="content">

                <h2>Популярні товари</h2>
                <ProductCarousel products={products} token={token} />

                <h2>Найкращі пропозиції для вас</h2>
                <ProductsForYou products={products} token={token} />

            </div>
        </div>
    )
}