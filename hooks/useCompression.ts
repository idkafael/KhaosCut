'use client';

import { useState } from 'react';
import { compressImage } from '@/lib/imageCompressor';
import { compressVideo } from '@/lib/videoCompressor';

export interface CompressedFile {
  file: File;
  compressedBlob: Blob;
  name: string;
}

export function useCompression() {
  const [files, setFiles] = useState<File[]>([]);
  const [imageQuality, setImageQuality] = useState<number>(80);
  const [videoQuality, setVideoQuality] = useState<string>('medium');
  const [compressedFiles, setCompressedFiles] = useState<CompressedFile[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<string>('');

  const processFiles = async () => {
    if (files.length === 0) {
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setCompressedFiles([]);

    const processed: CompressedFile[] = [];
    const total = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let compressedBlob: Blob | null = null;

        // Atualizar progresso inicial
        const initialProgress = (i / total) * 100;
        setProgress(initialProgress);
        setCurrentFile(file.name);

        try {
          console.log(`Processando arquivo ${i + 1}/${total}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
          
          // Verificar se é imagem ou vídeo (por tipo MIME ou extensão)
          const fileName = file.name.toLowerCase();
          const isImage = file.type.startsWith('image/') || 
            ['.jpg', '.jpeg', '.png', '.webp'].some(ext => fileName.endsWith(ext));
          const isVideo = file.type.startsWith('video/') || 
            ['.mp4', '.mov', '.avi', '.wmv', '.m4v'].some(ext => fileName.endsWith(ext));
          
          if (isImage) {
            console.log(`Comprimindo imagem: ${file.name} com qualidade ${imageQuality}%`);
            compressedBlob = await compressImage(file, imageQuality);
            const originalSize = file.size;
            const compressedSize = compressedBlob.size;
            const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
            console.log(`Imagem comprimida: ${file.name} - Redução: ${reduction}% (${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(compressedSize / 1024 / 1024).toFixed(2)} MB)`);
          } else if (isVideo) {
            console.log(`Comprimindo vídeo: ${file.name} com qualidade ${videoQuality}`);
            compressedBlob = await compressVideo(file, videoQuality);
            const originalSize = file.size;
            const compressedSize = compressedBlob.size;
            const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
            console.log(`Vídeo comprimido: ${file.name} - Redução: ${reduction}% (${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(compressedSize / 1024 / 1024).toFixed(2)} MB)`);
          } else {
            console.warn(`Tipo de arquivo não suportado: ${file.name} (${file.type})`);
          }

          if (compressedBlob) {
            // Manter o nome original com extensão
            const name = file.name;
            processed.push({
              file,
              compressedBlob,
              name,
            });
          }
        } catch (error) {
          console.error(`Erro ao comprimir ${file.name}:`, error);
          // Continuar com os outros arquivos mesmo se um falhar
        }

        // Atualizar progresso
        const currentProgress = ((i + 1) / total) * 100;
        setProgress(currentProgress);
      }

      setCompressedFiles(processed);
    } catch (error) {
      console.error('Erro na compressão:', error);
      alert('Erro ao comprimir arquivos. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setImageQuality(80);
    setVideoQuality('medium');
    setCompressedFiles([]);
    setProgress(0);
    setIsProcessing(false);
    setCurrentFile('');
  };

  return {
    files,
    setFiles,
    imageQuality,
    setImageQuality,
    videoQuality,
    setVideoQuality,
    compressedFiles,
    progress,
    isProcessing,
    currentFile,
    processFiles,
    reset,
  };
}
