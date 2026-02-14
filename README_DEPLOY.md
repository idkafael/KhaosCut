# 🚀 Deploy na Vercel - Guia Rápido

## Passo a Passo

### 1. Preparação Local

```bash
# Testar build localmente
npm run build

# Se funcionar, está pronto para deploy!
```

### 2. Deploy na Vercel

#### Via Dashboard (Mais Fácil):

1. Acesse https://vercel.com
2. Clique em "Add New Project"
3. Conecte seu repositório GitHub/GitLab
4. Configure:
   - **Framework Preset**: Next.js (auto-detectado)
   - **Root Directory**: `.`
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `.next` (automático)

5. **Variáveis de Ambiente**:
   - Settings → Environment Variables
   - Adicione: `NODE_ENV` = `production`
   - Selecione: Production, Preview, Development

6. Clique em "Deploy"

#### Via CLI:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod
```

### 3. Após o Deploy

1. **Adicionar Keys Iniciais**:
   - Acesse o projeto na Vercel
   - Vá em Settings → Environment Variables
   - Ou use a API para adicionar keys

2. **Testar**:
   - Acesse a URL fornecida pela Vercel
   - Teste o sistema de autenticação
   - Verifique se as keys funcionam

## ⚙️ Configurações Importantes

### Variáveis de Ambiente

| Variável | Valor | Obrigatório |
|----------|-------|-------------|
| `NODE_ENV` | `production` | ✅ Sim |

### Sistema de Keys

- O arquivo `data/keys.json` será criado automaticamente
- Em produção, keys são removidas após primeiro uso
- Usuário mantém acesso vitalício no navegador

## 📋 Checklist

- [ ] Build testado localmente (`npm run build`)
- [ ] Código commitado no repositório
- [ ] Projeto conectado na Vercel
- [ ] Variável `NODE_ENV=production` configurada
- [ ] Deploy realizado
- [ ] Site testado
- [ ] Keys adicionadas e testadas

## 🔧 Troubleshooting

### Build falha
- Verifique os logs na Vercel
- Teste localmente: `npm run build`

### Keys não funcionam
- Verifique se `NODE_ENV=production` está configurado
- Verifique se o diretório `data/` existe

### Erro 500
- Verifique os logs da Vercel
- Verifique se todas as dependências estão instaladas

## 📞 Suporte

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
