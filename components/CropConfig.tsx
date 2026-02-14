'use client';

interface CropConfigProps {
  pixels: number;
  onPixelsChange: (pixels: number) => void;
  enableCompression: boolean;
  onEnableCompressionChange: (enable: boolean) => void;
  imageQuality: number;
  onImageQualityChange: (quality: number) => void;
  videoQuality: string;
  onVideoQualityChange: (quality: string) => void;
}

export default function CropConfig({
  pixels,
  onPixelsChange,
  enableCompression,
  onEnableCompressionChange,
  imageQuality,
  onImageQualityChange,
  videoQuality,
  onVideoQualityChange,
}: CropConfigProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Configuração de Processamento</h2>
      
      <div className="space-y-6">
        {/* Seção de Corte */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary">Corte</h3>
          <div>
            <label
              htmlFor="direction"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Direção do Corte
            </label>
            <div className="px-4 py-3 bg-background-secondary border border-border-default rounded-lg text-text-primary">
              De baixo (Bottom)
            </div>
            <p className="text-text-secondary text-xs mt-1">
              O corte será feito removendo pixels da parte inferior
            </p>
          </div>

          <div>
            <label
              htmlFor="pixels"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Quantidade de Pixels
            </label>
            <input
              id="pixels"
              type="number"
              min="1"
              max="10000"
              value={pixels || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (value >= 0 && value <= 10000) {
                  onPixelsChange(value);
                }
              }}
              placeholder="Ex: 200"
              className="w-full px-4 py-3 bg-background-secondary border border-border-default rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-primary/20 transition-colors"
              required
            />
            <p className="text-text-secondary text-xs mt-1">
              Digite quantos pixels serão cortados da parte inferior (1-10000)
            </p>
          </div>
        </div>

        {/* Seção de Compressão */}
        <div className="space-y-4 border-t border-border-default pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-text-primary">Compressão</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableCompression}
                onChange={(e) => onEnableCompressionChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-background-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-primary"></div>
            </label>
          </div>

          {enableCompression && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
