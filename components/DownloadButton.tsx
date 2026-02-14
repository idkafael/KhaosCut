'use client';

import { useState } from 'react';
import JSZip from 'jszip';

interface ProcessedFile {
  file: File;
  processedBlob: Blob;
  name: string;
}

interface CompressedFile {
  file: File;
  compressedBlob: Blob;
  name: string;
}

interface DownloadButtonProps {
  files: ProcessedFile[] | CompressedFile[];
}

export default function DownloadButton({ files }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (files.length === 0) return;

    setDownloading(true);

    try {
      const zip = new JSZip();

      // Adicionar todos os arquivos processados/comprimidos ao ZIP
      for (const file of files) {
        // Suporta tanto ProcessedFile quanto CompressedFile
        const blob = 'processedBlob' in file ? file.processedBlob : file.compressedBlob;
        zip.file(file.name, blob);
      }

      // Gerar ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Criar link de download
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `arquivos-processados-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar ZIP:', error);
      alert('Erro ao gerar arquivo ZIP. Tente novamente.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Processamento Concluído!
      </h3>
      <p className="text-text-secondary mb-4">
        {files.length} arquivo(s) processado(s) com sucesso.
      </p>
      <button
        onClick={handleDownload}
        disabled={downloading || files.length === 0}
        className="px-6 py-3 bg-purple-primary hover:bg-purple-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? 'Gerando ZIP...' : `Baixar ZIP (${files.length} arquivos)`}
      </button>
    </div>
  );
}
