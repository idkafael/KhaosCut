export async function processImage(
  file: File,
  pixels: number,
  direction: 'bottom' | 'top' | 'left' | 'right',
  enableCompression: boolean = false,
  quality: number = 80
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'));
          return;
        }

        let newWidth = img.width;
        let newHeight = img.height;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

        // Calcular dimensões e posição baseado na direção
        switch (direction) {
          case 'bottom':
            newHeight = img.height - pixels;
            sourceHeight = newHeight;
            break;
          case 'top':
            newHeight = img.height - pixels;
            sourceY = pixels;
            sourceHeight = newHeight;
            break;
          case 'left':
            newWidth = img.width - pixels;
            sourceX = pixels;
            sourceWidth = newWidth;
            break;
          case 'right':
            newWidth = img.width - pixels;
            sourceWidth = newWidth;
            break;
        }

        // Validar dimensões
        if (newWidth <= 0 || newHeight <= 0) {
          reject(new Error('Dimensões inválidas após o corte'));
          return;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Desenhar a imagem cortada
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          newWidth,
          newHeight
        );

        // Determinar qualidade baseado na compressão
        // Se compressão desabilitada, usar qualidade alta (0.95)
        // Se habilitada, converter quality (0-100) para 0.1-1.0
        const compressionQuality = enableCompression 
          ? Math.max(0.1, Math.min(1.0, quality / 100))
          : 0.95;

        // Determinar tipo MIME - usar JPEG para melhor compressão se habilitada
        let mimeType = file.type || 'image/png';
        if (enableCompression && (mimeType === 'image/png' || mimeType === 'image/webp')) {
          // Converter PNG/WebP para JPEG para melhor compressão
          mimeType = 'image/jpeg';
        }

        // Converter para blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Erro ao converter canvas para blob'));
            }
          },
          mimeType,
          compressionQuality
        );
      };

      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'));
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsDataURL(file);
  });
}
