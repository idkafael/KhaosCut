/**
 * Script de inicialização para criar data/keys.json se não existir
 * Este script pode ser executado durante o build na Vercel
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const KEYS_FILE = path.join(DATA_DIR, 'keys.json');

// Criar diretório se não existir
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('✅ Diretório data/ criado');
}

// Criar arquivo keys.json se não existir
if (!fs.existsSync(KEYS_FILE)) {
  const initialKeys = {
    keys: []
  };
  fs.writeFileSync(KEYS_FILE, JSON.stringify(initialKeys, null, 2));
  console.log('✅ Arquivo data/keys.json criado');
} else {
  console.log('ℹ️  Arquivo data/keys.json já existe');
}

console.log('✅ Inicialização concluída');
