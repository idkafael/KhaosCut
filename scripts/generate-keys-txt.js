const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Função para gerar uma key única no formato "hotstore-key-XXXXX"
function generateKey() {
  const randomPart = crypto.randomBytes(8).toString('hex').toUpperCase();
  return `hotstore-key-${randomPart}`;
}

// Função para gerar múltiplas keys
function generateKeys(count = 100) {
  const keys = [];
  for (let i = 0; i < count; i++) {
    keys.push(generateKey());
  }
  return keys;
}

// Função principal
function main() {
  const args = process.argv.slice(2);
  const count = parseInt(args[0]) || 100;
  
  console.log(`Gerando ${count} keys no formato "hotstore-key-XXXXX"...`);
  const keys = generateKeys(count);
  
  // Criar conteúdo do arquivo TXT
  const txtContent = keys.join('\n');
  
  // Salvar em arquivo TXT
  const txtFilePath = path.join(__dirname, '..', 'keys.txt');
  fs.writeFileSync(txtFilePath, txtContent, 'utf-8');
  
  console.log('\nKeys geradas:');
  keys.forEach((key, index) => {
    console.log(`${index + 1}. ${key}`);
  });
  
  console.log(`\n✅ ${count} keys geradas com sucesso!`);
  console.log(`📁 Arquivo salvo em: ${txtFilePath}`);
  console.log(`\nTotal de linhas: ${keys.length}`);
}

// Executar
if (require.main === module) {
  main();
}

module.exports = { generateKey, generateKeys };
