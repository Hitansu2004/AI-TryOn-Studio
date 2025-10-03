import { apiClient } from '@/lib/api';
import { TryOnJob, TryOnRequest } from '@/types/api';

export const tryOnApi = {
  // Submit try-on job with existing product
  submitTryOnJobWithProduct: (
    productId: string,
    userImage: File,
    prompt: string
  ): Promise<TryOnJob> => {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('userImage', userImage);
    formData.append('prompt', prompt);

    return apiClient.postFormData<TryOnJob>('/api/tryon', formData);
  },

  // Submit try-on job with product image upload
  submitTryOnJobWithImage: (
    productImage: File,
    userImage: File,
    prompt: string
  ): Promise<TryOnJob> => {
    const formData = new FormData();
    formData.append('productImage', productImage);
    formData.append('userImage', userImage);
    formData.append('prompt', prompt);

    return apiClient.postFormData<TryOnJob>('/api/tryon', formData);
  },

  // Get job status
  getJobStatus: (jobId: string): Promise<TryOnJob> => {
    return apiClient.get<TryOnJob>(`/api/tryon/${jobId}`);
  },

  // Get all jobs (admin)
  getAllJobs: (): Promise<TryOnJob[]> => {
    return apiClient.get<TryOnJob[]>('/api/tryon/jobs');
  },
};

// Query keys for TanStack Query
export const tryOnKeys = {
  all: ['tryon'] as const,
  jobs: () => [...tryOnKeys.all, 'jobs'] as const,
  job: (jobId: string) => [...tryOnKeys.all, 'job', jobId] as const,
  status: (jobId: string) => [...tryOnKeys.all, 'status', jobId] as const,
};
