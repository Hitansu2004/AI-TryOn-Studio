export interface Product {
  id: string;
  name: string;
  sku: string;
  color?: string;
  description?: string;
  imageUrl: string;
  originalFilename: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  sku: string;
  color?: string;
  description?: string;
}

export interface TryOnJob {
  jobId: string;
  status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  resultImageUrl?: string;
  sourceProductId?: string;
  prompt: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
  estimatedProcessingTimeSeconds?: number;
}

export interface TryOnRequest {
  productId?: string;
  productImage?: File;
  userImage: File;
  prompt: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  filters?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}
