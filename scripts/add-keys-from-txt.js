const fs = require('fs');
const path = require('path');

const KEYS_TXT_PATH = path.join(__dirname, '..', 'keys.txt');
const KEYS_JSON_PATH = path.join(__dirname, '..', 'data', 'keys.json');

// Ler keys do arquivo TXT
const keysTxt = fs.readFileSync(KEYS_TXT_PATH, 'utf-8');
const keysFromTxt = keysTxt
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

console.log(`Encontradas ${keysFromTxt.length} keys no keys.txt`);

// Ler keys existentes do JSON
let existingKeys = [];
if (fs.existsSync(KEYS_JSON_PATH)) {
  const keysJson = fs.readFileSync(KEYS_JSON_PATH, 'utf-8');
  const keysData = JSON.parse(keysJson);
  existingKeys = keysData.keys || [];
  console.log(`Encontradas ${existingKeys.length} keys existentes no data/keys.json`);
}

// Combinar keys (remover duplicatas)
const allKeys = [...new Set([...existingKeys, ...keysFromTxt])];

console.log(`Total de keys únicas: ${allKeys.length}`);

// Garantir que o diretório existe
const dir = path.dirname(KEYS_JSON_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Salvar keys atualizadas
const keysData = { keys: allKeys };
fs.writeFileSync(KEYS_JSON_PATH, JSON.stringify(keysData, null, 2));

console.log(`✅ ${allKeys.length} keys salvas em data/keys.json`);
console.log(`   - ${existingKeys.length} keys existentes mantidas`);
console.log(`   - ${keysFromTxt.length} keys do keys.txt adicionadas`);
