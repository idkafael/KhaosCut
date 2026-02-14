const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const KEYS_FILE_PATH = path.join(__dirname, '..', 'data', 'keys.json');

// Função para gerar uma key única
function generateKey(prefix = 'KHAOS') {
  const randomPart = crypto.randomBytes(8).toString('hex').toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${randomPart}-${timestamp}`;
}

// Função para gerar múltiplas keys
function generateKeys(count = 10) {
  const keys = [];
  for (let i = 0; i < count; i++) {
    keys.push(generateKey());
  }
  return keys;
}

// Função para adicionar keys ao arquivo
function addKeysToFile(newKeys) {
  try {
    let existingKeys = [];
    
    // Ler keys existentes
    if (fs.existsSync(KEYS_FILE_PATH)) {
      const data = fs.readFileSync(KEYS_FILE_PATH, 'utf-8');
      const keysData = JSON.parse(data);
      existingKeys = keysData.keys || [];
    }
    
    // Adicionar novas keys (evitar duplicatas)
    const allKeys = [...existingKeys];
    newKeys.forEach(key => {
      if (!allKeys.includes(key)) {
        allKeys.push(key);
      }
    });
    
    // Garantir que o diretório existe
    const dir = path.dirname(KEYS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Salvar keys
    const keysData = { keys: allKeys };
    fs.writeFileSync(KEYS_FILE_PATH, JSON.stringify(keysData, null, 2));
    
    return allKeys;
  } catch (error) {
    console.error('Erro ao adicionar keys:', error);
    throw error;
  }
}

// Função principal
function main() {
  const args = process.argv.slice(2);
  const count = parseInt(args[0]) || 10;
  
  console.log(`Gerando ${count} keys...`);
  const newKeys = generateKeys(count);
  
  console.log('\nKeys geradas:');
  newKeys.forEach((key, index) => {
    console.log(`${index + 1}. ${key}`);
  });
  
  const allKeys = addKeysToFile(newKeys);
  
  console.log(`\n✅ Total de keys no arquivo: ${allKeys.length}`);
  console.log(`📁 Arquivo: ${KEYS_FILE_PATH}`);
}

// Executar
if (require.main === module) {
  main();
}

module.exports = { generateKey, generateKeys, addKeysToFile };
