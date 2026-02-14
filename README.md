# Cortador de Mídia em Massa

SaaS web para cortar imagens e vídeos em massa a partir de pixels. Processamento 100% client-side com design moderno escuro e aspecto roxo.

## Funcionalidades

- ✅ Autenticação via key vitalícia
- ✅ Upload de pasta inteira
- ✅ Corte de imagens (JPG, PNG, WebP)
- ✅ Corte de vídeos (MP4, MOV, AVI)
- ✅ Compressão de imagens e vídeos
- ✅ Processamento em lote com progresso
- ✅ Download em ZIP
- ✅ Design moderno escuro com tema roxo

## Tecnologias

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Canvas API (processamento de imagens)
- FFmpeg.wasm (processamento de vídeos)
- JSZip (geração de ZIP)

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Configuração de Keys

### Keys Disponíveis

As keys válidas estão em `data/keys.json`. Atualmente disponíveis:

- `demo-key-12345`
- `test-key-67890`

### Sistema de Keys Vitalícias

- **Keys são vitalícias**: Uma vez validadas, permanecem válidas para sempre
- **Em Desenvolvimento**: Keys podem ser reutilizadas para testes
- **Em Produção**: Keys são **deletadas automaticamente após uso** (uma key = um usuário)

### Adicionar Novas Keys

Para adicionar novas keys, edite o arquivo `data/keys.json` ou use o script:

```bash
node scripts/add-key.js sua-nova-key-aqui
```

**Importante**: 
- Não commite o arquivo `data/keys.json` com keys reais em produção
- Use variáveis de ambiente ou um banco de dados para keys em produção
- Em produção, cada key será usada apenas uma vez

## Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NODE_ENV=production  # ou development
```

- `NODE_ENV=production`: Keys são deletadas após uso
- `NODE_ENV=development`: Keys podem ser reutilizadas

## Build

```bash
npm run build
npm start
```

## Estrutura

- `app/` - Páginas e rotas da API
- `components/` - Componentes React
- `hooks/` - Custom hooks
- `lib/` - Bibliotecas de processamento
- `data/` - Dados (keys)

## Funcionalidades de Compressão

### Imagens
- Qualidade ajustável (10% a 100%)
- Conversão automática para JPEG quando compressão ativada
- Controle via slider

### Vídeos
- Três níveis: Alta, Média, Baixa
- Compressão de vídeo e áudio
- Otimização automática
