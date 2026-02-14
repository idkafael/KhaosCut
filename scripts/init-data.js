/**
 * Script de inicialização para criar data/keys.json se não existir
 * Este script pode ser executado durante o build na Vercel
 * Carrega keys do keys.txt se o arquivo existir
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const KEYS_FILE = path.join(DATA_DIR, 'keys.json');
const KEYS_TXT_FILE = path.join(process.cwd(), 'keys.txt');

// Criar diretório se não existir
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('✅ Diretório data/ criado');
}

let keys = [];

// Se keys.json já existe, carregar keys existentes
if (fs.existsSync(KEYS_FILE)) {
  try {
    const data = fs.readFileSync(KEYS_FILE, 'utf-8');
    const keysData = JSON.parse(data);
    keys = keysData.keys || [];
    console.log(`ℹ️  Carregadas ${keys.length} keys existentes de data/keys.json`);
  } catch (error) {
    console.error('Erro ao ler keys.json:', error);
  }
}

// Se keys.txt existe, carregar keys dele também
if (fs.existsSync(KEYS_TXT_FILE)) {
  try {
    const keysTxt = fs.readFileSync(KEYS_TXT_FILE, 'utf-8');
    const keysFromTxt = keysTxt
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Adicionar keys do TXT (remover duplicatas)
    const existingKeysSet = new Set(keys);
    let addedCount = 0;
    keysFromTxt.forEach(key => {
      if (!existingKeysSet.has(key)) {
        keys.push(key);
        existingKeysSet.add(key);
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      console.log(`✅ Adicionadas ${addedCount} keys do keys.txt`);
    }
  } catch (error) {
    console.error('Erro ao ler keys.txt:', error);
  }
}

// Salvar keys atualizadas
const keysData = { keys };
fs.writeFileSync(KEYS_FILE, JSON.stringify(keysData, null, 2));

if (keys.length === 0) {
  console.log('⚠️  Nenhuma key encontrada. Adicione keys em keys.txt ou data/keys.json');
} else {
  console.log(`✅ Total de ${keys.length} keys salvas em data/keys.json`);
}

console.log('✅ Inicialização concluída');
