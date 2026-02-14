export async function compressImage(
  file: File,
  quality: number = 80
): Promise<Blob> {
  console.log(`Iniciando compressão de imagem: ${file.name}, qualidade: ${quality}%`);
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

        // Manter dimensões originais (apenas compressão, sem corte)
        canvas.width = img.width;
        canvas.height = img.height;

        // Desenhar a imagem
        ctx.drawImage(img, 0, 0);

        // Converter qualidade (0-100) para 0.1-1.0
        const compressionQuality = Math.max(0.1, Math.min(1.0, quality / 100));

        // Determinar tipo MIME - usar JPEG para melhor compressão
        let mimeType = 'image/jpeg';
        if (file.type === 'image/png' && quality > 90) {
          // Manter PNG apenas se qualidade muito alta
          mimeType = 'image/png';
        }

        // Converter para blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const originalSize = file.size;
              const compressedSize = blob.size;
              const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
              console.log(`Compressão concluída: ${file.name} - ${reduction}% menor (${(originalSize / 1024).toFixed(2)} KB → ${(compressedSize / 1024).toFixed(2)} KB)`);
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
