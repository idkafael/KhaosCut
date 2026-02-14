'use client';

import { useRef, useState } from 'react';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export default function FileUpload({ files, onFilesChange }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = {
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    videos: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'],
  };

  const acceptedExtensions = {
    images: ['.jpg', '.jpeg', '.png', '.webp'],
    videos: ['.mp4', '.mov', '.avi', '.wmv', '.m4v'],
  };

  const allAcceptedTypes = [
    ...acceptedTypes.images,
    ...acceptedTypes.videos,
  ];

  const allAcceptedExtensions = [
    ...acceptedExtensions.images,
    ...acceptedExtensions.videos,
  ];

  const validateFile = (file: File): boolean => {
    // Verificar tipo MIME primeiro
    if (allAcceptedTypes.includes(file.type)) {
      return true;
    }
    
    // Se tipo MIME não estiver disponível ou não reconhecido, verificar extensão
    const fileName = file.name.toLowerCase();
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    return allAcceptedExtensions.includes(extension);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(fileList).forEach((file) => {
      if (validateFile(file)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      alert(
        `Os seguintes arquivos foram ignorados (tipo não suportado):\n${invalidFiles.join('\n')}`
      );
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Upload de Arquivos</h3>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragging
              ? 'border-purple-primary bg-purple-primary/10'
              : 'border-border-default hover:border-purple-primary/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={[...allAcceptedTypes, ...allAcceptedExtensions.map(ext => `*${ext}`)].join(',')}
          onChange={handleFileInput}
          className="hidden"
          // @ts-ignore - webkitdirectory não está no tipo padrão
          webkitdirectory=""
        />

        <div className="space-y-2">
          <div className="text-4xl mb-2">📁</div>
          <p className="text-text-primary font-medium">
            Arraste e solte arquivos aqui
          </p>
          <p className="text-text-secondary text-sm">ou clique para selecionar</p>
          <p className="text-text-secondary text-xs mt-2">
            Suporta: JPG, PNG, WebP, MP4, MOV, AVI, WMV, M4V
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            Arquivos selecionados ({files.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-background-secondary p-3 rounded-lg border border-border-default"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-text-secondary text-xs">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="ml-4 px-3 py-1 text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
