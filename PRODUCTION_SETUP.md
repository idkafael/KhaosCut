# Configuração para Produção

## ✅ NODE_ENV=production

O Next.js define `NODE_ENV` automaticamente, mas você pode forçar criando um arquivo:

### Opção 1: Arquivo .env.production.local (Recomendado)

Crie o arquivo `.env.production.local` na raiz do projeto:

```bash
NODE_ENV=production
```

**Nota**: Este arquivo está no `.gitignore` e não será commitado.

### Opção 2: Usar comandos do Next.js

O Next.js define automaticamente:
- `npm run dev` → `NODE_ENV=development`
- `npm run build` → `NODE_ENV=production`
- `npm start` → `NODE_ENV=production`

### Opção 3: Configurar no Hosting

Configure diretamente no seu provedor:

**Vercel:**
1. Settings → Environment Variables
2. Adicione: `NODE_ENV` = `production`

**Netlify:**
1. Site settings → Environment variables
2. Adicione: `NODE_ENV` = `production`

**Outros:**
Configure `NODE_ENV=production` nas variáveis de ambiente do servidor.

## Verificar Ambiente

Execute o script para verificar:

```bash
node scripts/check-env.js
```

## Sistema de Keys em Produção

Quando `NODE_ENV=production`:
- ✅ Keys são **removidas** após primeiro uso
- ✅ Uma key = um usuário (uso único)
- ✅ Usuário mantém acesso vitalício no navegador

## Testar Localmente em Modo Produção

```bash
# Build para produção
npm run build

# Iniciar em modo produção
npm start
```

Agora o sistema estará em modo produção e as keys serão removidas após uso.
