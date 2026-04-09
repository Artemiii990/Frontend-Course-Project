const API_URL = "https://localhost:44372/api/products"

export const getProducts = async () => {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error("Ошибка загрузки товаров")
    }

    return response.json()
}

export const addProduct = async (product: any) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    })

    return response.json()
}

export const deleteProduct = async (id: number) => {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
}