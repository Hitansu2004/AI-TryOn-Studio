'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Camera, RotateCcw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  label: string;
  description: string;
  preview?: string;
  className?: string;
  enableCamera?: boolean;
}

export function ImageUpload({
  onImageChange,
  accept = 'image/*',
  maxSize = 10,
  label,
  description,
  preview,
  className,
  enableCamera = false,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const validateFile = useCallback((file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    return null;
  }, [maxSize]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      setError(null);
      if (!files || files.length === 0) return;

      const file = files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        return;
      }

      onImageChange(file);
    },
    [onImageChange, validateFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const clearImage = () => {
    setError(null);
    onImageChange(null);
  };

  const startCamera = async () => {
    try {
      console.log('Starting camera...'); // Debug log
      setError(null);
      setShowCamera(true); // Show camera UI immediately
      
      // Detect if user is on mobile device for better camera selection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      console.log('Device info:', { isMobile, isSafari }); // Debug log
      
      // Enhanced camera constraints for better compatibility across devices
      let constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: isMobile ? 720 : 1280, min: 480, max: 1920 },
          height: { ideal: isMobile ? 1280 : 720, min: 640, max: 1080 },
          facingMode: 'user', // Front camera for selfies
          frameRate: { ideal: 30, min: 15 }
        }
      };

      // For Safari on Mac, use simpler constraints initially
      if (isSafari && !isMobile) {
        constraints = {
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser');
      }

      console.log('Requesting camera access with constraints:', constraints); // Debug log
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted, stream received'); // Debug log
      
      setStream(mediaStream);
      
      // Ensure video element is ready and start playback
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Auto-play the video stream
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, starting playback'); // Debug log
          if (videoRef.current) {
            videoRef.current.play().catch((err) => {
              console.error('Video play error:', err);
              // For Safari, try playing without sound
              videoRef.current!.muted = true;
              videoRef.current!.play().catch(console.error);
            });
          }
        };
      }
    } catch (err: any) {
      console.error('Camera error details:', err); // Debug log
      setShowCamera(false); // Hide camera UI on error
      
      // More specific error messages
      let errorMessage = 'Camera access failed';
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported by this browser.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints not supported. Trying with basic settings...';
        // Retry with basic constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(basicStream);
          setShowCamera(true);
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream;
          }
          return;
        } catch (retryErr) {
          console.error('Retry failed:', retryErr);
        }
      }
      
      setError(errorMessage);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCapturedPhoto(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !stream) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip the image horizontally to match the mirrored video display
    // This creates a natural selfie experience
    context.save();
    context.scale(-1, 1);
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.restore();

    // Get the captured photo as data URL for preview
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(photoDataUrl);
  };

  const proceedWithPhoto = () => {
    if (!capturedPhoto || !canvasRef.current) return;

    // Convert the captured photo to a file
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const file = new File([blob], `camera-capture-${timestamp}.jpg`, {
          type: 'image/jpeg',
        });
        
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }

        onImageChange(file);
        stopCamera();
        
        // Show success feedback
        setError(null);
      }
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setError(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium">{label}</label>
      
      <Card
        className={cn(
          'relative overflow-hidden transition-colors border-2 border-dashed',
          dragActive && 'border-primary bg-primary/5',
          error && 'border-destructive',
          preview && 'border-solid',
          !showCamera && !preview && 'cursor-pointer'
        )}
      >
        <CardContent className="p-0">
          {!showCamera && !preview && (
            <input
              type="file"
              accept={accept}
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label={label}
              id={`file-input-${label.replace(/\s+/g, '-').toLowerCase()}`}
            />
          )}
          
          <div
            onDragEnter={!showCamera && !preview ? handleDrag : undefined}
            onDragLeave={!showCamera && !preview ? handleDrag : undefined}
            onDragOver={!showCamera && !preview ? handleDrag : undefined}
            onDrop={!showCamera && !preview ? handleDrop : undefined}
            className="relative"
          >
            <AnimatePresence mode="wait">
              {showCamera ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative aspect-video bg-black rounded-lg overflow-hidden"
                >
                  {!stream ? (
                    // Loading state while camera is starting
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <div className="text-center text-white">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="mx-auto mb-2"
                        >
                          <Camera className="h-8 w-8" />
                        </motion.div>
                        <p className="text-sm">Starting camera...</p>
                      </div>
                    </div>
                  ) : null}
                  
                  {/* Live camera view */}
                  {!capturedPhoto && (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        style={{ transform: 'scaleX(-1)' }} // Mirror effect for natural selfie experience
                      />
                      
                      {/* Exit button (top right) */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={stopCamera}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      {/* Live camera controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                        <Button
                          type="button"
                          onClick={capturePhoto}
                          size="lg"
                          className="rounded-full bg-white text-black hover:bg-gray-100 shadow-lg"
                          disabled={!stream}
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          Capture
                        </Button>
                      </div>
                      
                      {/* Live indicator */}
                      {stream && (
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span>LIVE</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Captured photo preview */}
                  {capturedPhoto && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={capturedPhoto}
                        alt="Captured photo"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Exit button (top right) */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={stopCamera}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      {/* Photo preview controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                        <Button
                          type="button"
                          onClick={retakePhoto}
                          size="lg"
                          variant="outline"
                          className="rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Retake
                        </Button>
                        <Button
                          type="button"
                          onClick={proceedWithPhoto}
                          size="lg"
                          className="rounded-full bg-green-500 text-white hover:bg-green-600 shadow-lg"
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Use This Photo
                        </Button>
                      </div>
                      
                      {/* Captured indicator */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center space-x-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>CAPTURED</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                </motion.div>
              ) : preview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative aspect-square"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 px-6 text-center"
                >
                  <div className="mb-4">
                    {dragActive ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="p-4 rounded-full bg-primary/10"
                      >
                        <Upload className="h-8 w-8 text-primary" />
                      </motion.div>
                    ) : (
                      <div className="p-4 rounded-full bg-muted">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {dragActive ? 'Drop your image here' : 'Upload Image'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {description}
                  </p>
                  <div className="flex space-x-2 relative z-20">
                    <Button 
                      type="button" 
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log('Choose File button clicked'); // Debug log
                        // Find and trigger the file input
                        const fileInput = document.getElementById(`file-input-${label.replace(/\s+/g, '-').toLowerCase()}`) as HTMLInputElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      className="transition-all duration-200 hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                    {enableCamera && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={async (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          console.log('Camera button clicked'); // Debug log
                          await startCamera();
                        }}
                        className="transition-all duration-200 hover:scale-105 bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Camera
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}
      
      <p className="text-xs text-muted-foreground">
        Max file size: {maxSize}MB. Supported formats: JPEG, PNG
        {enableCamera && ' • Camera capture available (click Camera for instant access)'}
        {capturedPhoto && ' • Photo captured! Choose Retake or Use This Photo'}
      </p>
    </div>
  );
}
