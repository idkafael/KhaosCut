'use client';

import FileUpload from '@/components/FileUpload';
import CropConfig from '@/components/CropConfig';
import CompressionConfig from '@/components/CompressionConfig';
import ProgressBar from '@/components/ProgressBar';
import DownloadButton from '@/components/DownloadButton';
import { useCropProcessing } from '@/hooks/useCropProcessing';
import { useCompression } from '@/hooks/useCompression';

export default function Home() {
  const {
    files,
    setFiles,
    pixels,
    setPixels,
    enableCompression,
    setEnableCompression,
    imageQuality: cropImageQuality,
    setImageQuality: setCropImageQuality,
    videoQuality: cropVideoQuality,
    setVideoQuality: setCropVideoQuality,
    processedFiles,
    progress: cropProgress,
    isProcessing: isCropProcessing,
    processFiles: processCropFiles,
    reset: resetCrop,
  } = useCropProcessing();

  const {
    files: compressionFiles,
    setFiles: setCompressionFiles,
    imageQuality: compressionImageQuality,
    setImageQuality: setCompressionImageQuality,
    videoQuality: compressionVideoQuality,
    setVideoQuality: setCompressionVideoQuality,
    compressedFiles,
    progress: compressionProgress,
    isProcessing: isCompressionProcessing,
    currentFile: compressionCurrentFile,
    processFiles: processCompressionFiles,
    reset: resetCompression,
  } = useCompression();

  const handleCropProcess = async () => {
    if (files.length === 0 || !pixels || pixels <= 0) {
      alert('Por favor, selecione arquivos e defina a quantidade de pixels');
      return;
    }
    await processCropFiles();
  };

  const handleCompressionProcess = async () => {
    if (compressionFiles.length === 0) {
      alert('Por favor, selecione arquivos para comprimir');
      return;
    }
    await processCompressionFiles();
  };

  return (
    <main className="min-h-screen bg-background-primary p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 text-gradient-purple">
              Khaos Helper
            </h1>
          </div>
        </div>

        {/* Seção de Corte */}
        <div className="bg-background-card rounded-lg border border-border-default p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            Cortador de Mídias
          </h2>
          <FileUpload files={files} onFilesChange={setFiles} />
        </div>

        {files.length > 0 && (
          <>
            <div className="bg-background-card rounded-lg border border-border-default p-6 mb-6">
              <CropConfig
                pixels={pixels}
                onPixelsChange={setPixels}
                enableCompression={enableCompression}
                onEnableCompressionChange={setEnableCompression}
                imageQuality={cropImageQuality}
                onImageQualityChange={setCropImageQuality}
                videoQuality={cropVideoQuality}
                onVideoQualityChange={setCropVideoQuality}
              />
            </div>

            {!isCropProcessing && processedFiles.length === 0 && (
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={handleCropProcess}
                  className="px-6 py-3 bg-purple-primary hover:bg-purple-light text-white font-semibold rounded-lg transition-colors"
                >
                  Processar Corte
                </button>
                <button
                  onClick={resetCrop}
                  className="px-6 py-3 bg-background-secondary hover:bg-background-card text-text-primary border border-border-default font-semibold rounded-lg transition-colors"
                >
                  Limpar
                </button>
              </div>
            )}

            {isCropProcessing && (
              <div className="bg-background-card rounded-lg border border-border-default p-6 mb-6">
                <ProgressBar progress={cropProgress} />
              </div>
            )}

            {processedFiles.length > 0 && !isCropProcessing && (
              <div className="bg-background-card rounded-lg border border-border-default p-6 mb-6">
                <DownloadButton files={processedFiles} />
              </div>
            )}
          </>
        )}

        {/* Seção de Compressão */}
        <div className="bg-background-card rounded-lg border border-border-default p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Compressor de Mídias</h2>
          <FileUpload files={compressionFiles} onFilesChange={setCompressionFiles} />
        </div>

        {compressionFiles.length > 0 && (
          <>
            <div className="bg-background-card rounded-lg border border-border-default p-6 mb-6">
              <CompressionConfig
                imageQuality={compressionImageQuality}
                onImageQualityChange={setCompressionImageQuality}
                videoQuality={compressionVideoQuality}
                onVideoQualityChange={setCompressionVideoQuality}
              />
            </div>

            {!isCompressionProcessing && compressedFiles.length === 0 && (
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={handleCompressionProcess}
                  className="px-6 py-3 bg-purple-primary hover:bg-purple-light text-white font-semibold rounded-lg transition-colors"
                >
                  Comprimir Arquivos
                </button>
                <button
                  onClick={resetCompression}
                  className="px-6 py-3 bg-background-secondary hover:bg-background-card text-text-primary border border-border-default font-semibold rounded-lg transition-colors"
                >
                  Limpar
                </button>
              </div>
            )}

            {isCompressionProcessing && (
              <div className="bg-background-card rounded-lg border border-border-default p-6 mb-6">
                <ProgressBar progress={compressionProgress} currentFile={compressionCurrentFile} />
              </div>
            )}

            {compressedFiles.length > 0 && !isCompressionProcessing && (
              <div className="bg-background-card rounded-lg border border-border-default p-6">
                <DownloadButton files={compressedFiles} />
              </div>
            )}
          </>
        )}

        {/* Seção Me Contrate */}
        <div className="mt-12 pt-8 border-t border-border-default">
          <div className="flex flex-col items-center justify-center gap-6">
            <h3 className="text-2xl font-semibold text-text-primary">Me Contrate</h3>
            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com/phlafael"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:opacity-80 transition-opacity shadow-lg hover:scale-110 transform transition-transform"
                aria-label="Instagram phlafael"
                title="Instagram @phlafael"
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
