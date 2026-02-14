/**
 * Script para verificar e configurar NODE_ENV
 * Uso: node scripts/check-env.js
 */

console.log('=== Verificação de Ambiente ===\n');
console.log('NODE_ENV atual:', process.env.NODE_ENV || 'não definido');
console.log('');

// Verificar se está em produção
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

if (isProduction) {
  console.log('✅ Ambiente: PRODUÇÃO');
  console.log('   - Keys serão removidas após primeiro uso (uso único)');
  console.log('   - Sistema de keys funcionando em modo produção');
} else if (isDevelopment) {
  console.log('✅ Ambiente: DESENVOLVIMENTO');
  console.log('   - Keys podem ser reutilizadas para testes');
  console.log('   - Keys não serão removidas do arquivo');
} else {
  console.log('⚠️  Ambiente não definido');
  console.log('   - Next.js define automaticamente:');
  console.log('     • npm run dev → development');
  console.log('     • npm run build → production');
  console.log('     • npm start → production');
}

console.log('\n=== Como configurar ===');
console.log('1. Para produção: npm run build && npm start');
console.log('2. Para desenvolvimento: npm run dev');
console.log('3. Ou criar arquivo .env.production.local com: NODE_ENV=production');
