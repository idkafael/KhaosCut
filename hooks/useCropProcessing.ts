'use client';

import { useState } from 'react';
import { processImage } from '@/lib/imageProcessor';
import { processVideo } from '@/lib/videoProcessor';

export interface ProcessedFile {
  file: File;
  processedBlob: Blob;
  name: string;
}

export function useCropProcessing() {
  const [files, setFiles] = useState<File[]>([]);
  const [pixels, setPixels] = useState<number>(0);
  const [enableCompression, setEnableCompression] = useState<boolean>(false);
  const [imageQuality, setImageQuality] = useState<number>(80);
  const [videoQuality, setVideoQuality] = useState<string>('medium');
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const processFiles = async () => {
    if (files.length === 0 || pixels <= 0) {
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessedFiles([]);

    const processed: ProcessedFile[] = [];
    const total = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let processedBlob: Blob | null = null;

        try {
          // Verificar se é imagem ou vídeo (por tipo MIME ou extensão)
          const fileName = file.name.toLowerCase();
          const isImage = file.type.startsWith('image/') || 
            ['.jpg', '.jpeg', '.png', '.webp'].some(ext => fileName.endsWith(ext));
          const isVideo = file.type.startsWith('video/') || 
            ['.mp4', '.mov', '.avi', '.wmv', '.m4v'].some(ext => fileName.endsWith(ext));
          
          if (isImage) {
            processedBlob = await processImage(
              file,
              pixels,
              'bottom',
              enableCompression,
              imageQuality
            );
          } else if (isVideo) {
            processedBlob = await processVideo(
              file,
              pixels,
              'bottom',
              enableCompression,
              videoQuality
            );
          }

          if (processedBlob) {
            // Manter o nome original com extensão
            const name = file.name;
            processed.push({
              file,
              processedBlob,
              name,
            });
          }
        } catch (error) {
          console.error(`Erro ao processar ${file.name}:`, error);
          // Continuar com os outros arquivos mesmo se um falhar
        }

        // Atualizar progresso
        const currentProgress = ((i + 1) / total) * 100;
        setProgress(currentProgress);
      }

      setProcessedFiles(processed);
    } catch (error) {
      console.error('Erro no processamento:', error);
      alert('Erro ao processar arquivos. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setPixels(0);
    setEnableCompression(false);
    setImageQuality(80);
    setVideoQuality('medium');
    setProcessedFiles([]);
    setProgress(0);
    setIsProcessing(false);
  };

  return {
    files,
    setFiles,
    pixels,
    setPixels,
    enableCompression,
    setEnableCompression,
    imageQuality,
    setImageQuality,
    videoQuality,
    setVideoQuality,
    processedFiles,
    progress,
    isProcessing,
    processFiles,
    reset,
  };
}
