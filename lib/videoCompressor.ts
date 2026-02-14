import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let isFFmpegLoaded = false;

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && isFFmpegLoaded) {
    return ffmpegInstance;
  }

  console.log('Carregando FFmpeg.wasm...');
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  ffmpegInstance = new FFmpeg();

  // Carregar FFmpeg.wasm
  if (!isFFmpegLoaded) {
    // Criar promise com timeout
    const loadWithTimeout = <T>(loadPromise: Promise<T>, timeout: number = 30000): Promise<T> => {
      return Promise.race([
        loadPromise,
        new Promise<T>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout ao carregar FFmpeg')), timeout)
        )
      ]);
    };

    try {
      console.log('Tentativa 1: Carregando FFmpeg UMD...');
      // Primeira tentativa: usar versão UMD (mais compatível)
      await loadWithTimeout(ffmpegInstance.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
      }));
      isFFmpegLoaded = true;
      console.log('FFmpeg carregado com sucesso (UMD)');
    } catch (error) {
      console.error('Erro ao carregar FFmpeg (UMD):', error);
      // Segunda tentativa: usar versão ESM
      try {
        console.log('Tentativa 2: Carregando FFmpeg ESM...');
        await loadWithTimeout(ffmpegInstance.load({
          coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
          wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
        }));
        isFFmpegLoaded = true;
        console.log('FFmpeg carregado com sucesso (ESM)');
      } catch (error2) {
        console.error('Erro ao carregar FFmpeg (ESM):', error2);
        // Terceira tentativa: usar versão core-st (single-threaded)
        try {
          console.log('Tentativa 3: Carregando FFmpeg core-st...');
          await loadWithTimeout(ffmpegInstance.load({
            coreURL: 'https://unpkg.com/@ffmpeg/core-st@0.12.6/dist/umd/ffmpeg-core.js',
            wasmURL: 'https://unpkg.com/@ffmpeg/core-st@0.12.6/dist/umd/ffmpeg-core.wasm',
          }));
          isFFmpegLoaded = true;
          console.log('FFmpeg carregado com sucesso (core-st)');
        } catch (error3) {
          console.error('Erro ao carregar FFmpeg (core-st):', error3);
          throw new Error('Erro ao carregar FFmpeg.wasm - todas as tentativas falharam. Verifique sua conexão com a internet.');
        }
      }
    }
  }

  return ffmpegInstance;
}

export async function compressVideo(
  file: File,
  quality: string = 'medium'
): Promise<Blob> {
  console.log(`Iniciando compressão de vídeo: ${file.name}, qualidade: ${quality}`);
  const originalSize = file.size;
  console.log(`Tamanho original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
  
  const ffmpeg = await getFFmpeg();
  const inputFileName = 'input.' + file.name.split('.').pop();
  const outputFileName = 'output.mp4';

  try {
    console.log('Escrevendo arquivo de entrada no FFmpeg...');
    // Escrever arquivo de entrada
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));
    console.log('Arquivo escrito com sucesso. Iniciando processamento FFmpeg...');

    // Configurar qualidade de compressão
    // CRF (Constant Rate Factor): menor = melhor qualidade, maior = menor tamanho
    let crf = '23'; // padrão média
    let preset = 'fast';
    let audioBitrate = '128k';

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

    // Configurar callbacks de progresso
    ffmpeg.on('log', ({ message, type }) => {
      if (type === 'info' || type === 'fferr') {
        console.log(`[FFmpeg ${type}]: ${message}`);
      }
    });
    
    // Monitorar progresso (se disponível)
    ffmpeg.on('progress', ({ progress, time }) => {
      if (progress !== undefined) {
        console.log(`Progresso FFmpeg: ${(progress * 100).toFixed(1)}%`);
      }
      if (time !== undefined) {
        console.log(`Tempo processado: ${time}ms`);
      }
    });

    // Executar FFmpeg - apenas compressão, sem corte
    console.log(`Executando FFmpeg com parâmetros: CRF=${crf}, Preset=${preset}, Audio=${audioBitrate}`);
    console.log('⚠️ Processamento de vídeo pode demorar vários minutos dependendo do tamanho...');
    const startTime = Date.now();
    
    // Criar promise com timeout (10 minutos para vídeos grandes)
    const execWithTimeout = async () => {
      const execPromise = ffmpeg.exec([
        '-i',
        inputFileName,
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

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout: Processamento demorou mais de 10 minutos. Tente com um vídeo menor ou qualidade mais baixa.'));
        }, 600000); // 10 minutos
      });

      return Promise.race([execPromise, timeoutPromise]);
    };
    
    try {
      await execWithTimeout();
      
      const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`✅ FFmpeg processamento concluído em ${processingTime} segundos`);
    } catch (execError) {
      console.error('❌ Erro durante execução do FFmpeg:', execError);
      throw execError;
    }

    // Ler arquivo de saída
    console.log('Lendo arquivo de saída...');
    const data = await ffmpeg.readFile(outputFileName);

    // Limpar arquivos temporários
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    // Converter FileData para Blob
    // readFile retorna Uint8Array ou string, verificar tipo e converter
    let compressedBlob: Blob;
    if (data instanceof Uint8Array) {
      // Criar novo Uint8Array para garantir compatibilidade com Blob
      const uint8Array = new Uint8Array(data);
      compressedBlob = new Blob([uint8Array], { type: 'video/mp4' });
    } else {
      // Se for string, converter para Blob diretamente
      compressedBlob = new Blob([data], { type: 'video/mp4' });
    }
    const compressedSize = compressedBlob.size;
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    console.log(`Compressão concluída: ${file.name} - ${reduction}% menor (${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(compressedSize / 1024 / 1024).toFixed(2)} MB)`);
    return compressedBlob;
  } catch (error) {
    console.error('Erro ao comprimir vídeo:', error);
    throw new Error('Erro ao comprimir vídeo com FFmpeg');
  }
}
