# 🔧 Troubleshooting - Erro 404 na Vercel

## Possíveis Causas e Soluções

### 1. ✅ Verificar Build na Vercel
- Acesse o dashboard da Vercel
- Vá em **Deployments**
- Clique no último deployment
- Verifique se o build foi bem-sucedido
- Se houver erros, veja os logs

### 2. ✅ Verificar Variáveis de Ambiente
Certifique-se de que TODAS estas variáveis estão configuradas na Vercel:

**Obrigatórias:**
```
PUSHINPAY_TOKEN=57071|53RpxxhqVpvIqCv9cabBXR39qIayarUCH5N44Dv180331a6f
PUSHINPAY_API_URL=https://api.pushinpay.com.br
NEXT_PUBLIC_SITE_URL=https://www.privacycombrcheckoutluna.shop
NEXT_PUBLIC_BASE_URL=https://www.privacycombrcheckoutluna.shop
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=856032176652340
```

**Opcional (mas recomendada):**
```
PUSHINPAY_REDIRECT_URL=https://privacycombrcheckoutluna.shop
```

### 3. ✅ Verificar Domínio Customizado
- Vá em **Settings** → **Domains**
- Certifique-se de que `privacycombrcheckoutluna.shop` está configurado
- Verifique os registros DNS se necessário

### 4. ✅ Verificar Estrutura de Arquivos
O projeto deve ter:
- ✅ `pages/index.js` (página principal)
- ✅ `pages/_app.js`
- ✅ `package.json` com script `build`
- ✅ `next.config.js`

### 5. ✅ Rebuild Manual
1. Vá em **Deployments**
2. Clique nos 3 pontos do último deployment
3. Selecione **Redeploy**
4. Aguarde o build completar

### 6. ✅ Verificar Logs
- Acesse **Functions** → **Logs** na Vercel
- Procure por erros relacionados a:
  - Variáveis de ambiente faltando
  - Erros de build
  - Erros de runtime

### 7. ✅ Testar Localmente
```bash
npm run build
npm start
```
Se funcionar localmente, o problema é na configuração da Vercel.

## Checklist Rápido

- [ ] Build na Vercel foi bem-sucedido?
- [ ] Todas as variáveis de ambiente estão configuradas?
- [ ] Domínio está configurado corretamente?
- [ ] O repositório está conectado corretamente?
- [ ] O branch `master` está sendo usado?

## Comandos Úteis

```bash
# Verificar se o build funciona localmente
npm run build

# Testar produção localmente
npm start

# Verificar variáveis de ambiente
npm run dev
```

