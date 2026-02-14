/**
 * Script para preparar keys para variável de ambiente
 * Lê keys de data/keys.json e keys.txt e gera formato para variável de ambiente
 */

const fs = require('fs');
const path = require('path');

const KEYS_FILE_PATH = path.join(__dirname, '..', 'data', 'keys.json');
const KEYS_TXT_PATH = path.join(__dirname, '..', 'keys.txt');

function prepareKeys() {
  let allKeys = [];

  // Ler keys do arquivo JSON
  if (fs.existsSync(KEYS_FILE_PATH)) {
    try {
      const data = fs.readFileSync(KEYS_FILE_PATH, 'utf-8');
      const keysData = JSON.parse(data);
      allKeys.push(...(keysData.keys || []));
      console.log(`📄 Encontradas ${keysData.keys?.length || 0} keys em data/keys.json`);
    } catch (error) {
      console.error('Erro ao ler keys.json:', error);
    }
  }

  // Ler keys do arquivo TXT
  if (fs.existsSync(KEYS_TXT_PATH)) {
    try {
      const keysTxt = fs.readFileSync(KEYS_TXT_PATH, 'utf-8');
      const keysFromTxt = keysTxt
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      allKeys.push(...keysFromTxt);
      console.log(`📄 Encontradas ${keysFromTxt.length} keys em keys.txt`);
    } catch (error) {
      console.error('Erro ao ler keys.txt:', error);
    }
  }

  // Remover duplicatas
  const uniqueKeys = [...new Set(allKeys)];
  console.log(`\n🔑 Total de ${uniqueKeys.length} keys únicas\n`);

  if (uniqueKeys.length === 0) {
    console.log('⚠️  Nenhuma key encontrada');
    return;
  }

  // Gerar formato para variável de ambiente
  // Opção 1: Separado por vírgula (mais compacto)
  const commaSeparated = uniqueKeys.join(',');
  console.log('📋 Formato para variável de ambiente (vírgulas):');
  console.log('─'.repeat(80));
  console.log(commaSeparated);
  console.log('─'.repeat(80));

  // Opção 2: Separado por quebra de linha (mais legível)
  const newlineSeparated = uniqueKeys.join('\n');
  console.log('\n📋 Formato para variável de ambiente (quebras de linha):');
  console.log('─'.repeat(80));
  console.log(newlineSeparated);
  console.log('─'.repeat(80));

  console.log('\n✅ Como usar:');
  console.log('1. Vá em Vercel Dashboard → Seu Projeto → Settings → Environment Variables');
  console.log('2. Adicione uma nova variável:');
  console.log('   Nome: VALID_KEYS');
  console.log('   Valor: Cole uma das opções acima');
  console.log('   Ambiente: Production (e Development se quiser)');
  console.log('3. Salve e faça redeploy');
}

if (require.main === module) {
  prepareKeys();
}

module.exports = { prepareKeys };
