# 🤖 EuTranscrevo Bot para WhatsApp

Bot inteligente para WhatsApp que transcreve mensagens de áudio automaticamente usando IA. Desenvolvido com Node.js, whatsapp-web.js e a API Replicate (Whisper large-v3).

## ✨ Funcionalidades

### 🎯 Principais
- **Transcrição Automática**: Converte áudios em texto usando IA avançada
- **Sessão Persistente**: Salva a sessão do WhatsApp localmente (sem QR Code repetido)
- **Otimização Inteligente**: Reduz tamanho do áudio antes do envio para economia
- **Suporte Multi-idioma**: Detecta automaticamente o idioma do áudio
- **Tratamento de Erros**: Sistema robusto de tratamento de falhas

### 📱 Comandos Disponíveis
- `!ping` - Testa se o bot está funcionando
- **Áudio/Voz** - Transcreve automaticamente qualquer mensagem de áudio

## 🏗️ Arquitetura do Projeto

```
cliente-bot/
├── 📁 commands/           # Comandos do bot
│   ├── transcrever.js     # Processamento principal de áudio
│   ├── ajuda.js          # Comando de ajuda
│   └── sugestoes.js      # Sugestões de conteúdo
├── 📁 services/          # Serviços externos
│   ├── audioOptimizer.js # Otimização com ffmpeg
│   └── replicateClient.js # Integração com API Replicate
├── 📁 utils/             # Utilitários
│   └── fileUtils.js      # Operações com arquivos
├── 📁 temp/              # Arquivos temporários
├── 📁 sessao-whatsapp/   # Sessão do WhatsApp (criada automaticamente)
├── main.js               # Arquivo principal do bot
├── package.json          # Dependências do projeto
└── README.md            # Este arquivo
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- **Node.js** v18 ou superior
- **ffmpeg** instalado e no PATH do sistema
- **Conta Replicate** com API Token
- **WhatsApp** com sessão válida

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/parrelladev/EuTranscrevo_bot_Whatsapp.git
cd cliente-bot
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz:
```env
REPLICATE_TOKEN=seu_token_aqui
```

4. **Verifique o ffmpeg**
```bash
ffmpeg -version
```

5. **Execute o bot**
```bash
node main.js
```

## 🔧 Configurações Avançadas

### Arquivo de Configuração Centralizada
Todas as configurações estão centralizadas no arquivo `config.js`:

```javascript
// Exemplo de configurações que podem ser alteradas:
{
  audio: {
    optimization: {
      speed: 1.0,           // Velocidade de reprodução
      volume: 1.0,          // Volume do áudio
      bitrate: '32k',       // Bitrate para economia
      channels: 1,          // Mono (1 canal)
      format: 'mp3'         // Formato de saída
    }
  },
  replicate: {
    transcription: {
      language: "auto",     // Detecção automática
      temperature: 0,       // Resultado consistente
      // ... mais configurações
    }
  }
}
```

### Parâmetros de Transcrição
O bot usa configurações otimizadas para qualidade máxima:

```javascript
{
  language: "auto",                    // Detecta idioma automaticamente
  translate: false,                    // Mantém idioma original
  temperature: 0,                      // Resultado consistente
  transcription: "plain text",         // Formato simples
  no_speech_threshold: 0.6,            // Detecta silêncio
  condition_on_previous_text: true,    // Considera contexto
  compression_ratio_threshold: 2.4     // Threshold de compressão
}
```

### Otimização de Áudio
- **Formato**: MP3 (configurável)
- **Canais**: Mono (1 canal) (configurável)
- **Bitrate**: 32k (configurável)
- **Volume**: Ajustável
- **Velocidade**: Configurável

### 🔧 Personalização
Para alterar configurações:
1. Edite o arquivo `config.js`
2. Reinicie o bot
3. As mudanças são aplicadas automaticamente

## 🛠️ Desenvolvimento

### Adicionando Novos Comandos

1. Crie um arquivo em `commands/`
```javascript
// commands/novoComando.js
module.exports = function novoComando(message) {
  message.reply('Resposta do novo comando!');
};
```

2. Registre no `main.js`
```javascript
const novoComando = require('./commands/novoComando');

// No evento de mensagem
if (message.body === '!novo') {
  return novoComando(message);
}
```

### Estrutura de Logs
O bot utiliza emojis para facilitar a identificação de logs:
- 🎧 Áudio recebido
- 📥 Arquivo salvo
- 🎛️ Otimização em andamento
- 📡 Envio para API
- ✅ Sucesso
- ❌ Erro
- ⚠️ Aviso

## 🔒 Segurança

### Validações Implementadas
- Verificação de tipo de arquivo (apenas áudios)
- Limpeza automática de arquivos temporários
- Tratamento de erros robusto
- Timeout para operações de rede

### Boas Práticas
- Tokens em variáveis de ambiente
- Validação de entrada de dados
- Logs sem informações sensíveis
- Limpeza de recursos temporários

## 📊 Monitoramento

### Logs Importantes
```bash
✅ Cliente está pronto!           # Bot conectado
🎧 Áudio recebido!               # Processamento iniciado
📥 Áudio salvo: /path/file.mp3   # Arquivo salvo
🎛️ Otimizando áudio...          # Otimização em andamento
📡 Enviando para o Replicate...  # API chamada
✅ Transcrição enviada           # Sucesso
```

## 🐛 Solução de Problemas

### Problemas Comuns

**QR Code não aparece**
- Verifique se o WhatsApp está logado
- Delete a pasta `sessao-whatsapp/` e reinicie

**Erro de transcrição**
- Verifique se o token do Replicate está correto
- Confirme se o ffmpeg está instalado
- Verifique a conexão com a internet

**Áudio não processado**
- Confirme se é um arquivo de áudio válido
- Verifique permissões de escrita no diretório temp

### Debug
Ative logs detalhados adicionando:
```javascript
console.log('DEBUG:', { message, media, fileType });
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.