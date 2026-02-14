# Guia de Deploy na Vercel - Khaos Helper

## 📋 Pré-requisitos

1. Conta na Vercel (https://vercel.com)
2. Projeto no GitHub/GitLab/Bitbucket (recomendado)
3. Node.js 18+ instalado localmente

## 🚀 Deploy Rápido

### Opção 1: Deploy via Dashboard Vercel (Recomendado)

1. **Acesse a Vercel**
   - Vá para https://vercel.com
   - Faça login com GitHub/GitLab/Bitbucket

2. **Importe o Projeto**
   - Clique em "Add New Project"
   - Selecione o repositório do projeto
   - Ou faça upload do código

3. **Configure o Projeto**
   - Framework Preset: **Next.js** (detectado automaticamente)
   - Root Directory: `.` (raiz)
   - Build Command: `npm run build` (automático)
   - Output Directory: `.next` (automático)
   - Install Command: `npm install` (automático)

4. **Configure Variáveis de Ambiente**
   - Vá em Settings → Environment Variables
   - Adicione:
     ```
     NODE_ENV=production
     ```
   - Selecione: Production, Preview, Development

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Seu site estará online! 🎉

### Opção 2: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod
```

## ⚙️ Configurações Importantes

### 1. Variáveis de Ambiente na Vercel

Configure em **Settings → Environment Variables**:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `NODE_ENV` | `production` | Production, Preview, Development |

### 2. Sistema de Keys

O arquivo `data/keys.json` será criado automaticamente na Vercel.

**Importante**: 
- Em produção, as keys serão removidas após primeiro uso
- Você pode adicionar keys via API ou diretamente no arquivo após deploy
- O arquivo `data/keys.json` está no `.gitignore` para não expor keys no repositório

### 3. Região

O projeto está configurado para usar a região **gru1** (São Paulo, Brasil) no `vercel.json`.

## 📁 Estrutura de Arquivos

```
.
├── app/                    # Next.js App Router
├── components/             # Componentes React
├── hooks/                  # Custom hooks
├── lib/                    # Bibliotecas e utilitários
├── data/                   # Keys (criado automaticamente)
├── public/                 # Arquivos estáticos
├── scripts/                # Scripts auxiliares
├── next.config.js          # Configuração Next.js
├── vercel.json             # Configuração Vercel
└── package.json            # Dependências
```

## 🔧 Troubleshooting

### Erro: "Module not found"
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente antes de fazer deploy

### Erro: "Build failed"
- Verifique os logs de build na Vercel
- Teste localmente: `npm run build`

### Keys não funcionam
- Verifique se `NODE_ENV=production` está configurado
- Verifique se o diretório `data/` existe (será criado automaticamente)

### FFmpeg.wasm não carrega
- Verifique a conexão com unpkg.com (CDN)
- Pode ser necessário configurar headers CORS

## 📝 Checklist de Deploy

- [ ] Código commitado no repositório
- [ ] `package.json` atualizado
- [ ] `vercel.json` configurado
- [ ] Variável `NODE_ENV=production` configurada na Vercel
- [ ] Build testado localmente (`npm run build`)
- [ ] Deploy realizado
- [ ] Site testado após deploy
- [ ] Sistema de keys testado

## 🔐 Segurança

### Recomendações:

1. **Keys**: 
   - Não commite `data/keys.json` com keys reais
   - Use variáveis de ambiente para keys sensíveis (futuro)
   - Considere usar hash das keys ao invés de texto plano

2. **Variáveis de Ambiente**:
   - Nunca commite arquivos `.env` com dados sensíveis
   - Use apenas variáveis de ambiente da Vercel

3. **Rate Limiting**:
   - Considere adicionar rate limiting na API de validação de keys

## 📊 Monitoramento

Após o deploy, você pode:
- Ver logs em tempo real no dashboard da Vercel
- Monitorar performance
- Ver analytics de uso
- Configurar webhooks

## 🎯 Próximos Passos

1. Configure domínio customizado (opcional)
2. Configure SSL (automático na Vercel)
3. Configure analytics (opcional)
4. Adicione monitoramento de erros (Sentry, etc.)

## 📞 Suporte

- Documentação Vercel: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
