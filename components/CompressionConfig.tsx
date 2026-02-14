'use client';

interface CompressionConfigProps {
  imageQuality: number;
  onImageQualityChange: (quality: number) => void;
  videoQuality: string;
  onVideoQualityChange: (quality: string) => void;
}

export default function CompressionConfig({
  imageQuality,
  onImageQualityChange,
  videoQuality,
  onVideoQualityChange,
}: CompressionConfigProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Configuração de Compressão</h2>
      
      <div className="space-y-4">
        <div>
          <label
            htmlFor="imageQuality"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Qualidade de Imagens: {imageQuality}%
          </label>
          <input
            id="imageQuality"
            type="range"
            min="10"
            max="100"
            step="5"
            value={imageQuality}
            onChange={(e) => onImageQualityChange(parseInt(e.target.value))}
            className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-purple-primary"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>Menor tamanho (10%)</span>
            <span>Maior qualidade (100%)</span>
          </div>
          <p className="text-text-secondary text-xs mt-1">
            Valores menores = arquivos menores, mas menor qualidade
          </p>
        </div>

        <div>
          <label
            htmlFor="videoQuality"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Qualidade de Vídeos
          </label>
          <select
            id="videoQuality"
            value={videoQuality}
            onChange={(e) => onVideoQualityChange(e.target.value)}
            className="w-full px-4 py-3 bg-background-secondary border border-border-default rounded-lg text-text-primary focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20 transition-colors"
          >
            <option value="high">Alta (melhor qualidade, arquivo maior)</option>
            <option value="medium">Média (balanceado)</option>
            <option value="low">Baixa (menor tamanho, qualidade reduzida)</option>
          </select>
          <p className="text-text-secondary text-xs mt-1">
            Escolha o nível de compressão para vídeos
          </p>
        </div>
      </div>
    </div>
  );
}
