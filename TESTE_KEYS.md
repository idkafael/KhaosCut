# Teste de Sistema de Keys - Uso Único

## ✅ Status: FUNCIONAL

### Como Funciona

1. **Em Produção (`NODE_ENV=production`)**:
   - ✅ Key é **removida** do arquivo `data/keys.json` após primeira validação
   - ✅ Uma key = um usuário (uso único garantido)
   - ✅ Se alguém tentar usar a mesma key novamente, receberá erro "Key inválida ou já foi utilizada"
   - ✅ Usuário que validou mantém acesso vitalício no navegador (localStorage)

2. **Em Desenvolvimento (`NODE_ENV=development`)**:
   - ✅ Keys podem ser reutilizadas para testes
   - ✅ Keys não são removidas do arquivo

### Fluxo de Validação

```
1. Usuário insere key
   ↓
2. API valida key no servidor
   ↓
3. Se válida:
   ├─ Em PRODUÇÃO: Key é REMOVIDA do arquivo (uso único)
   └─ Key é salva no localStorage (acesso vitalício)
   ↓
4. Próximas visitas: Autenticação automática via localStorage
```

### Teste Manual

#### Teste 1: Uso Único em Produção
1. Configure `NODE_ENV=production`
2. Use uma key válida
3. Verifique que a key foi removida de `data/keys.json`
4. Tente usar a mesma key novamente
5. **Resultado esperado**: Erro "Key inválida ou já foi utilizada"

#### Teste 2: Acesso Vitalício
1. Use uma key válida
2. Feche o navegador
3. Abra novamente
4. **Resultado esperado**: Autenticação automática (sem pedir key novamente)

#### Teste 3: Reutilização em Desenvolvimento
1. Configure `NODE_ENV=development`
2. Use uma key válida
3. Verifique que a key AINDA está em `data/keys.json`
4. Use a mesma key novamente
5. **Resultado esperado**: Funciona normalmente (pode reutilizar)

### Garantias

✅ **Uso Único**: Em produção, cada key só pode ser usada uma vez
✅ **Acesso Vitalício**: Usuário mantém acesso pelo navegador para sempre
✅ **Remoção Automática**: Key é removida automaticamente após primeiro uso em produção
✅ **Validação no Servidor**: Toda validação passa pelo servidor (não pode ser burlada)

### Arquivos Envolvidos

- `lib/keyValidator.ts` - Lógica de validação e remoção
- `app/api/validate-key/route.ts` - API endpoint de validação
- `hooks/useKeyAuth.ts` - Hook de autenticação no cliente
- `data/keys.json` - Arquivo com lista de keys válidas
