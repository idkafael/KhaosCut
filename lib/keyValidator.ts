import fs from 'fs';
import path from 'path';

const KEYS_FILE_PATH = path.join(process.cwd(), 'data', 'keys.json');

interface KeysData {
  keys: string[];
}

/**
 * Obter todas as keys válidas
 * Prioriza variável de ambiente, com fallback para arquivo
 */
function getAllKeys(): string[] {
  // Primeiro: tentar ler de variável de ambiente (mais simples e persiste)
  const envKeys = process.env.VALID_KEYS;
  if (envKeys) {
    try {
      // Keys separadas por vírgula ou quebra de linha
      const keys = envKeys
        .split(/[,\n]/)
        .map(k => k.trim())
        .filter(k => k.length > 0);
      if (keys.length > 0) {
        console.log(`✅ Usando ${keys.length} keys da variável de ambiente`);
        console.log(`Primeira key: ${keys[0]?.substring(0, 20)}...`);
        return keys;
      }
    } catch (error) {
      console.error('Erro ao ler keys da variável de ambiente:', error);
    }
  } else {
    console.log('⚠️  Variável VALID_KEYS não encontrada, usando fallback para arquivo');
  }

  // Fallback: ler do arquivo
  try {
    if (fs.existsSync(KEYS_FILE_PATH)) {
      const data = fs.readFileSync(KEYS_FILE_PATH, 'utf-8');
      const keysData: KeysData = JSON.parse(data);
      const keys = keysData.keys || [];
      if (keys.length > 0) {
        console.log(`✅ Usando ${keys.length} keys do arquivo`);
        return keys;
      }
    }
  } catch (error) {
    console.error('Erro ao ler arquivo de keys:', error);
  }

  return [];
}

// Função para remover key
function removeKey(key: string): void {
  // Se está usando variável de ambiente, não podemos remover (é read-only)
  // Mas podemos marcar como usada em um arquivo separado
  if (process.env.VALID_KEYS) {
    // Salvar keys usadas em um arquivo para não reutilizar
    const usedKeysPath = path.join(process.cwd(), 'data', 'used_keys.json');
    let usedKeys: string[] = [];
    
    try {
      if (fs.existsSync(usedKeysPath)) {
        const data = fs.readFileSync(usedKeysPath, 'utf-8');
        usedKeys = JSON.parse(data).keys || [];
      }
    } catch (error) {
      // Ignorar erro
    }

    if (!usedKeys.includes(key)) {
      usedKeys.push(key);
      const dir = path.dirname(usedKeysPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(usedKeysPath, JSON.stringify({ keys: usedKeys }, null, 2));
      console.log(`✅ Key marcada como usada: ${key.substring(0, 20)}...`);
    }
    return;
  }

  // Se está usando arquivo, remover normalmente
  try {
    const keys = getAllKeys();
    const updatedKeys = keys.filter(k => k !== key);
    
    const dir = path.dirname(KEYS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const keysData: KeysData = { keys: updatedKeys };
    fs.writeFileSync(KEYS_FILE_PATH, JSON.stringify(keysData, null, 2));
    console.log(`✅ Key removida do arquivo: ${key.substring(0, 20)}...`);
  } catch (error) {
    console.error('Erro ao remover key:', error);
  }
}

// Função para verificar se key já foi usada
function isKeyUsed(key: string): boolean {
  const usedKeysPath = path.join(process.cwd(), 'data', 'used_keys.json');
  
  try {
    if (fs.existsSync(usedKeysPath)) {
      const data = fs.readFileSync(usedKeysPath, 'utf-8');
      const usedKeys = JSON.parse(data).keys || [];
      return usedKeys.includes(key);
    }
  } catch (error) {
    // Ignorar erro
  }
  
  return false;
}

// Função para validar key
// IMPORTANTE: Keys são VITALÍCIAS - uma vez validadas, permanecem válidas para sempre
// Em PRODUÇÃO: Keys são deletadas após uso (uma key = um usuário)
// Em DESENVOLVIMENTO: Keys podem ser reutilizadas
export async function validateKey(key: string, removeAfterUse: boolean = false): Promise<boolean> {
  // Verificar se key já foi usada (em produção)
  if (removeAfterUse && isKeyUsed(key)) {
    console.log(`⚠️  Key já foi usada: ${key.substring(0, 20)}...`);
    return false;
  }

  // Obter todas as keys válidas
  const validKeys = getAllKeys();
  console.log(`🔍 Validando key: ${key.substring(0, 20)}...`);
  console.log(`📊 Total de keys válidas: ${validKeys.length}`);
  
  // Verificar se a key está na lista
  const isValid = validKeys.includes(key);
  
  if (!isValid) {
    console.log(`❌ Key não encontrada na lista`);
    // Debug: verificar se há keys similares
    const similar = validKeys.filter(k => k.substring(0, 10) === key.substring(0, 10));
    if (similar.length > 0) {
      console.log(`💡 Encontradas ${similar.length} keys similares (primeiros 10 chars)`);
    }
    return false;
  }

  // Se key é válida E deve ser removida após uso (produção)
  if (removeAfterUse) {
    // IMPORTANTE: Marcar como usada ANTES de retornar para garantir uso único
    removeKey(key);
    console.log(`✅ Key marcada como usada (uso único): ${key.substring(0, 20)}...`);
  }
  
  return true;
}

// Função para adicionar key (útil para administração)
export function addKey(key: string): void {
  // Se está usando variável de ambiente, não podemos adicionar
  if (process.env.VALID_KEYS) {
    console.log('⚠️  Keys estão em variável de ambiente. Adicione manualmente no Vercel Dashboard.');
    return;
  }

  // Adicionar ao arquivo
  try {
    const keys = getAllKeys();
    
    if (!keys.includes(key)) {
      keys.push(key);
      
      const dir = path.dirname(KEYS_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const keysData: KeysData = { keys };
      fs.writeFileSync(KEYS_FILE_PATH, JSON.stringify(keysData, null, 2));
      console.log(`✅ Key adicionada: ${key.substring(0, 20)}...`);
    } else {
      console.log('Key já existe');
    }
  } catch (error) {
    console.error('Erro ao adicionar key:', error);
  }
}

// Função para obter todas as keys (útil para administração)
export function getAllValidKeys(): string[] {
  return getAllKeys();
}
