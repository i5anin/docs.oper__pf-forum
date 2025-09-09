// /.vitepress/api.ts
export interface Product {
  id: number
  title: string
  description: string
  price: number
  brand?: string
  category?: string
}

export function createApi() {
  const baseURL = 'https://dummyjson.com'

  async function request<T>(path: string): Promise<T> {
    const res = await fetch(`${baseURL}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `HTTP ${res.status}`)
    }
    return res.json() as Promise<T>
  }

  return {
    async getProduct(id: number): Promise<Product> {
      return request<Product>(`/products/${id}`)
    },
  }
}
