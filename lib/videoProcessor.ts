import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let isFFmpegLoaded = false;

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && isFFmpegLoaded) {
    return ffmpegInstance;
  }

  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  ffmpegInstance = new FFmpeg();

  // Carregar FFmpeg.wasm
  if (!isFFmpegLoaded) {
    try {
      // Primeira tentativa: usar versão UMD (mais compatível)
      await ffmpegInstance.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
      });
      isFFmpegLoaded = true;
    } catch (error) {
      console.error('Erro ao carregar FFmpeg (UMD):', error);
      // Segunda tentativa: usar versão ESM
      try {
        await ffmpegInstance.load({
          coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
          wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
        });
        isFFmpegLoaded = true;
      } catch (error2) {
        console.error('Erro ao carregar FFmpeg (ESM):', error2);
        // Terceira tentativa: usar versão core-st (single-threaded)
        try {
          await ffmpegInstance.load({
            coreURL: 'https://unpkg.com/@ffmpeg/core-st@0.12.6/dist/umd/ffmpeg-core.js',
            wasmURL: 'https://unpkg.com/@ffmpeg/core-st@0.12.6/dist/umd/ffmpeg-core.wasm',
          });
          isFFmpegLoaded = true;
        } catch (error3) {
          console.error('Erro ao carregar FFmpeg (core-st):', error3);
          throw new Error('Erro ao carregar FFmpeg.wasm - todas as tentativas falharam');
        }
      }
    }
  }

  return ffmpegInstance;
}

export async function processVideo(
  file: File,
  pixels: number,
  direction: 'bottom' | 'top' | 'left' | 'right',
  enableCompression: boolean = false,
  quality: string = 'medium'
): Promise<Blob> {
  const ffmpeg = await getFFmpeg();
  const inputFileName = 'input.' + file.name.split('.').pop();
  const outputFileName = 'output.mp4'; // Sempre usar MP4 para melhor compatibilidade

  try {
    // Escrever arquivo de entrada
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));

    // Calcular dimensões e filtro baseado na direção
    let filter = '';
    switch (direction) {
      case 'bottom':
        // Cortar de baixo: manter altura original - pixels
        filter = `crop=iw:ih-${pixels}:0:0`;
        break;
      case 'top':
        // Cortar de cima: manter altura original - pixels, começar de pixels
        filter = `crop=iw:ih-${pixels}:0:${pixels}`;
        break;
      case 'left':
        // Cortar da esquerda: manter largura original - pixels, começar de pixels
        filter = `crop=iw-${pixels}:ih:${pixels}:0`;
        break;
      case 'right':
        // Cortar da direita: manter largura original - pixels
        filter = `crop=iw-${pixels}:ih:0:0`;
        break;
    }

    // Configurar qualidade de compressão
    // CRF (Constant Rate Factor): menor = melhor qualidade, maior = menor tamanho
    // 18 = alta qualidade, 23 = média, 28 = baixa
    let crf = '23'; // padrão média
    let preset = 'fast';
    let audioBitrate = '128k';

    if (enableCompression) {
      switch (quality) {
        case 'high':
          crf = '20'; // Alta qualidade
          preset = 'medium';
          audioBitrate = '192k';
          break;
        case 'medium':
          crf = '23'; // Qualidade média
          preset = 'fast';
          audioBitrate = '128k';
          break;
        case 'low':
          crf = '28'; // Baixa qualidade, maior compressão
          preset = 'ultrafast';
          audioBitrate = '96k';
          break;
      }
    } else {
      // Sem compressão, manter qualidade original
      crf = '18';
      preset = 'medium';
      audioBitrate = '192k';
    }

    // Executar FFmpeg
    await ffmpeg.exec([
      '-i',
      inputFileName,
      '-vf',
      filter,
      '-c:v',
      'libx264',
      '-preset',
      preset,
      '-crf',
      crf,
      '-c:a',
      'aac',
      '-b:a',
      audioBitrate,
      '-movflags',
      '+faststart',
      outputFileName,
    ]);

    // Ler arquivo de saída
    const data = await ffmpeg.readFile(outputFileName);

    // Limpar arquivos temporários
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    // Converter FileData (Uint8Array) para Blob
    // readFile retorna Uint8Array, que precisa ser convertido corretamente
    return new Blob([data as Uint8Array], { type: file.type || 'video/mp4' });
  } catch (error) {
    console.error('Erro ao processar vídeo:', error);
    throw new Error('Erro ao processar vídeo com FFmpeg');
  }
}
