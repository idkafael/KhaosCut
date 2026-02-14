import fs from 'fs';
import path from 'path';

const KEYS_FILE_PATH = path.join(process.cwd(), 'data', 'keys.json');

interface KeysData {
  keys: string[];
}

// Função para ler keys do arquivo
function readKeys(): string[] {
  try {
    if (fs.existsSync(KEYS_FILE_PATH)) {
      const data = fs.readFileSync(KEYS_FILE_PATH, 'utf-8');
      const keysData: KeysData = JSON.parse(data);
      return keysData.keys || [];
    }
  } catch (error) {
    console.error('Erro ao ler arquivo de keys:', error);
  }
  return [];
}

// Função para remover key do arquivo
function removeKey(key: string): void {
  try {
    const keys = readKeys();
    const updatedKeys = keys.filter(k => k !== key);
    
    // Garantir que o diretório existe
    const dir = path.dirname(KEYS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Salvar keys atualizadas
    const keysData: KeysData = { keys: updatedKeys };
    fs.writeFileSync(KEYS_FILE_PATH, JSON.stringify(keysData, null, 2));
  } catch (error) {
    console.error('Erro ao remover key:', error);
  }
}

// Função para validar key
// IMPORTANTE: Keys são VITALÍCIAS - uma vez validadas, permanecem válidas para sempre
// Em PRODUÇÃO: Keys são deletadas após uso (uma key = um usuário)
// Em DESENVOLVIMENTO: Keys podem ser reutilizadas
export async function validateKey(key: string, removeAfterUse: boolean = false): Promise<boolean> {
  // Ler keys do arquivo
  const validKeys = readKeys();
  
  // Verificar se a key está na lista de keys válidas
  // Em produção, você deve usar hash para comparar (não armazenar keys em texto plano)
  const isValid = validKeys.includes(key);
  
  // Se key é válida E deve ser removida após uso (produção)
  if (isValid && removeAfterUse) {
    // IMPORTANTE: Remover ANTES de retornar para garantir uso único
    // Isso garante que mesmo em caso de requisições simultâneas,
    // apenas a primeira validação bem-sucedida vai passar
    removeKey(key);
    console.log(`✅ Key removida após uso (uso único): ${key.substring(0, 20)}...`);
  }
  
  return isValid;
}

// Função para adicionar key (útil para administração)
export function addKey(key: string): void {
  try {
    const keys = readKeys();
    
    if (!keys.includes(key)) {
      keys.push(key);
      
      // Garantir que o diretório existe
      const dir = path.dirname(KEYS_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Salvar keys
      const keysData: KeysData = { keys };
      fs.writeFileSync(KEYS_FILE_PATH, JSON.stringify(keysData, null, 2));
    }
  } catch (error) {
    console.error('Erro ao adicionar key:', error);
  }
}
