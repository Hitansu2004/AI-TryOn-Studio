import { apiClient } from '@/lib/api';
import { Product, ProductRequest, PaginationParams } from '@/types/api';

export const productApi = {
  // Get all products
  getProducts: (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/api/products');
  },

  // Get product by ID
  getProductById: (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/api/products/${id}`);
  },

  // Create product with image upload
  createProduct: (
    productData: ProductRequest,
    image: File
  ): Promise<Product> => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', productData.name);
    formData.append('sku', productData.sku);
    if (productData.color) formData.append('color', productData.color);
    if (productData.description) formData.append('description', productData.description);

    return apiClient.postFormData<Product>('/api/products', formData);
  },

  // Update product metadata
  updateProduct: (id: string, productData: ProductRequest): Promise<Product> => {
    return apiClient.put<Product>(`/api/products/${id}`, productData);
  },

  // Delete product
  deleteProduct: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/api/products/${id}`);
  },
};

// Query keys for TanStack Query
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};
