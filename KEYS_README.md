# Sistema de Keys - Khaos Helper

## Como Funciona

### 1. **Keys Vitalícias**
- Uma vez que um usuário valida uma key, ela fica salva no `localStorage` do navegador
- O acesso é **vitalício** - nunca expira
- Mesmo que o usuário feche o navegador, a key permanece válida

### 2. **Produção vs Desenvolvimento**

#### **Em Produção** (`NODE_ENV=production`):
- ✅ Key é **removida** do arquivo `data/keys.json` após o primeiro uso
- ✅ Uma key = um usuário (uso único)
- ✅ Usuário mantém acesso vitalício pelo navegador

#### **Em Desenvolvimento** (`NODE_ENV=development`):
- ✅ Keys podem ser **reutilizadas** para testes
- ✅ Keys não são removidas do arquivo

### 3. **Arquivo de Keys**

As keys são armazenadas em: `data/keys.json`

```json
{
  "keys": [
    "KHAOS-A0F7FC52F84123DB-MLMH28TR",
    "KHAOS-BF89DE8B2261BD7C-MLMH28TR",
    ...
  ]
}
```

## Gerar Novas Keys

Use o script para gerar keys:

```bash
# Gerar 10 keys (padrão)
node scripts/generate-keys.js

# Gerar quantidade específica
node scripts/generate-keys.js 50
```

## Fluxo de Validação

1. **Usuário insere key** → `KeyAuth.tsx`
2. **Validação no servidor** → `/api/validate-key`
3. **Se válida:**
   - Em produção: key é removida do arquivo
   - Key é salva no `localStorage` do navegador
   - Usuário tem acesso vitalício
4. **Próximas visitas:**
   - Sistema verifica `localStorage`
   - Se encontrar key, autentica automaticamente

## Adicionar Keys Manualmente

Você pode adicionar keys manualmente editando `data/keys.json` ou usando a função `addKey()` em `lib/keyValidator.ts`.

## Segurança

⚠️ **Importante para Produção:**
- Considere usar hash das keys ao invés de texto plano
- Use variáveis de ambiente para keys sensíveis
- Implemente rate limiting na API de validação
- Monitore tentativas de validação inválidas

## Lista de Keys Atuais

Para ver todas as keys disponíveis, consulte `data/keys.json`.
