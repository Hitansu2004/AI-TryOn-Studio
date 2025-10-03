'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { TryOnJob } from '@/types/api';

interface TryOnProgressProps {
  job: TryOnJob;
  elapsedTime: number;
}

export function TryOnProgress({ job, elapsedTime }: TryOnProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (job.status === 'RUNNING') {
      // Simulate progress based on elapsed time and estimated time
      const estimatedTime = job.estimatedProcessingTimeSeconds || 60;
      const progressPercent = Math.min((elapsedTime / estimatedTime) * 100, 90);
      
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = Math.min(prev + 1, progressPercent);
          return newProgress;
        });
      }, 1000);
    } else if (job.status === 'SUCCEEDED') {
      setProgress(100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [job.status, elapsedTime, job.estimatedProcessingTimeSeconds]);

  const getStatusIcon = () => {
    switch (job.status) {
      case 'QUEUED':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'RUNNING':
        return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />;
      case 'SUCCEEDED':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (job.status) {
      case 'QUEUED':
        return 'Your try-on request is in queue...';
      case 'RUNNING':
        return 'AI is processing your try-on...';
      case 'SUCCEEDED':
        return 'Try-on completed successfully!';
      case 'FAILED':
        return job.errorMessage || 'Try-on failed. Please try again.';
      default:
        return 'Processing...';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {getStatusIcon()}
          </motion.div>
          <div className="flex-1">
            <h3 className="font-semibold">{getStatusMessage()}</h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Job ID: {job.jobId}</span>
              <span>Time: {formatTime(elapsedTime)}</span>
            </div>
          </div>
        </div>

        {(job.status === 'QUEUED' || job.status === 'RUNNING') && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {job.estimatedProcessingTimeSeconds && (
              <p className="text-xs text-muted-foreground">
                Estimated time: {job.estimatedProcessingTimeSeconds}s
              </p>
            )}
          </div>
        )}

        {job.status === 'FAILED' && job.errorMessage && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-md">
            <p className="text-sm text-destructive">{job.errorMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
