# Configuração de Variáveis de Ambiente

## Como o NODE_ENV funciona no Next.js

O Next.js define `NODE_ENV` automaticamente:

- **`npm run dev`** → `NODE_ENV=development`
- **`npm run build`** → `NODE_ENV=production`
- **`npm start`** → `NODE_ENV=production`

## Para Produção

### Opção 1: Deixar automático (Recomendado)
O Next.js já define `NODE_ENV=production` quando você faz build ou start.

### Opção 2: Criar arquivo .env.production.local
Crie um arquivo `.env.production.local` na raiz do projeto:

```bash
NODE_ENV=production
```

### Opção 3: Configurar no servidor/hosting
Configure a variável de ambiente diretamente no seu provedor de hosting:
- **Vercel**: Settings → Environment Variables
- **Netlify**: Site settings → Environment variables
- **Outros**: Configure `NODE_ENV=production` nas variáveis de ambiente

## Verificar NODE_ENV

Para verificar qual ambiente está ativo, você pode adicionar um log temporário:

```typescript
console.log('NODE_ENV:', process.env.NODE_ENV);
```

## Sistema de Keys

O sistema de keys detecta automaticamente o ambiente:
- **Development**: Keys podem ser reutilizadas
- **Production**: Keys são removidas após primeiro uso (uso único)

## Arquivos .env

- `.env.local` - Variáveis locais (não commitado)
- `.env.production` - Variáveis de produção
- `.env.production.local` - Variáveis de produção locais (não commitado)
- `.env.development` - Variáveis de desenvolvimento
- `.env.development.local` - Variáveis de desenvolvimento locais (não commitado)

**Nota**: Arquivos `.env*.local` estão no `.gitignore` e não são commitados.
