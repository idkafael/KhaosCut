'use client';

interface ProgressBarProps {
  progress: number;
  currentFile?: string;
}

export default function ProgressBar({ progress, currentFile }: ProgressBarProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Processando...</h3>
        <span className="text-text-secondary text-sm">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-background-secondary rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-purple transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {currentFile && (
        <p className="text-text-secondary text-xs mt-2">
          Processando: {currentFile}
        </p>
      )}
      <p className="text-text-secondary text-xs mt-1">
        {progress === 0 ? 'Iniciando processamento...' : 'Aguarde enquanto processamos seus arquivos...'}
      </p>
    </div>
  );
}
