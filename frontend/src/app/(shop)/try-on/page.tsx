'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Sparkles, ArrowRight, RefreshCw, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/image-upload';
import { TryOnProgress } from '@/components/try-on-progress';
import { productApi, productKeys } from '@/lib/products';
import { tryOnApi, tryOnKeys } from '@/lib/tryon';
import { TryOnJob } from '@/types/api';
import { logger } from '@/utils/logger';

function TryOnContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  
  const [userImage, setUserImage] = useState<File | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [currentJob, setCurrentJob] = useState<TryOnJob | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [visualizationStarted, setVisualizationStarted] = useState(false);

  // Fetch product if productId is provided
  const { data: product } = useQuery({
    queryKey: productKeys.detail(productId!),
    queryFn: () => productApi.getProductById(productId!),
    enabled: !!productId,
  });

  // Poll job status
  const { data: jobStatus } = useQuery({
    queryKey: tryOnKeys.status(currentJob?.jobId || ''),
    queryFn: () => tryOnApi.getJobStatus(currentJob!.jobId),
    enabled: !!currentJob && ['QUEUED', 'RUNNING'].includes(currentJob.status),
    refetchInterval: 2000, // Poll every 2 seconds
  });

  // Submit try-on mutation
  const submitTryOnMutation = useMutation({
    mutationFn: async () => {
      if (!userImage) throw new Error('User image is required');
      
      // Log try-on visualization start
      if (productId) {
        logger.tryOnVisualizationStarted(productId);
      }
      
      if (productId) {
        // Use automatic prompts - no user prompt needed
        return tryOnApi.submitTryOnJobWithProduct(productId, userImage, '');
      } else if (productImage) {
        // Use automatic prompts - no user prompt needed  
        return tryOnApi.submitTryOnJobWithImage(productImage, userImage, '');
      } else {
        throw new Error('Either product ID or product image is required');
      }
    },
    onSuccess: (job) => {
      setCurrentJob(job);
      setElapsedTime(0);
      setVisualizationStarted(true);
      toast.success('Visualization started!');
      
      // Log successful start
      if (productId) {
        logger.tryOnStarted(productId);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to start visualization');
      
      // Log error
      if (productId) {
        logger.tryOnVisualizationFailed(productId, error.message || 'Unknown error');
      }
    },
  });

  // Update job status when polling returns new data
  useEffect(() => {
    if (jobStatus && currentJob) {
      setCurrentJob(jobStatus);
      if (jobStatus.status === 'SUCCEEDED') {
        toast.success('Virtual try-on completed!');
        
        // Log successful completion
        if (productId) {
          logger.tryOnVisualizationCompleted(productId, elapsedTime);
        }
      } else if (jobStatus.status === 'FAILED') {
        toast.error('Virtual try-on failed. Please try again.');
        
        // Log failure
        if (productId) {
          logger.tryOnVisualizationFailed(productId, jobStatus.errorMessage || 'Unknown error');
        }
      }
    }
  }, [jobStatus, currentJob, elapsedTime, productId]);

  // Track elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentJob && ['QUEUED', 'RUNNING'].includes(currentJob.status)) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentJob]);

  // Handle user image change
  const handleUserImageChange = (file: File | null) => {
    setUserImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUserImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      
      // Log image upload
      if (productId) {
        logger.tryOnImageUploaded(productId, file.size);
      }
    } else {
      setUserImagePreview(null);
    }
  };

  // Handle product image change
  const handleProductImageChange = (file: File | null) => {
    setProductImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProductImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setProductImagePreview(null);
    }
  };

  const handleVisualize = () => {
    submitTryOnMutation.mutate();
  };

  const resetTryOn = () => {
    setCurrentJob(null);
    setElapsedTime(0);
    setVisualizationStarted(false);
  };

  const canVisualize = userImage && (product || productImage) && !submitTryOnMutation.isPending;

  return (
    <>
      <div className="container py-8 max-w-6xl">
        <div
          
          
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Try Yourself</h1>
          <p className="text-muted-foreground">
            See how products look on you with AI-powered virtual fitting
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div
            
            
            
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Try Yourself Setup</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Selection */}
                <div>
                  <h3 className="font-semibold mb-4">1. Select Product</h3>
                  {product ? (
                    <Card className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <ImageUpload
                      onImageChange={handleProductImageChange}
                      label="Product Image"
                      description="Upload the product you want to try on"
                      preview={productImagePreview || undefined}
                    />
                  )}
                </div>

                {/* User Image Upload */}
                <div>
                  <h3 className="font-semibold mb-4">2. Upload Your Photo</h3>
                  <ImageUpload
                    onImageChange={handleUserImageChange}
                    label="Your Photo"
                    description="Upload a clear photo of yourself or take one with your camera"
                    preview={userImagePreview || undefined}
                    enableCamera={true}
                  />
                </div>

                {/* Visualize Button */}
                <Button
                  onClick={handleVisualize}
                  disabled={!canVisualize}
                  className="w-full"
                  size="lg"
                >
                  {submitTryOnMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {submitTryOnMutation.isPending ? 'Generating...' : 'Visualize'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div
            
            
            
          >
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <>
                  {currentJob ? (
                    <div
                      
                      
                      
                      className="space-y-6"
                    >
                      <TryOnProgress job={currentJob} elapsedTime={elapsedTime} />
                      
                      {currentJob.status === 'SUCCEEDED' && currentJob.resultImageUrl && (
                        <div
                          
                          
                          className="space-y-4"
                        >
                          <div className="relative aspect-square rounded-lg overflow-hidden">
                            <Image
                              src={currentJob.resultImageUrl}
                              alt="Try-on result"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={resetTryOn} variant="outline" className="flex-1">
                              Try Again
                            </Button>
                            <Button className="flex-1">
                              Save Result
                            </Button>
                          </div>
                        </div>
                      )}

                      {currentJob.status === 'FAILED' && (
                        <div
                          
                          
                          className="text-center py-8"
                        >
                          <Button onClick={resetTryOn}>
                            Try Again
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      
                      
                      
                      className="text-center py-12 text-muted-foreground"
                    >
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Upload your images and start the try-on process</p>
                    </div>
                  )}
                </>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TryOnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
        <div className="container py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading try-on experience...</p>
          </div>
        </div>
      </div>
    }>
      <TryOnContent />
    </Suspense>
  );
}
