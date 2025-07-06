# 🤖 EuTranscrevo Bot para WhatsApp

Bot inteligente para WhatsApp que transcreve mensagens de áudio automaticamente usando IA. Desenvolvido com Node.js, whatsapp-web.js e a API Replicate (Whisper large-v3).

## ✨ Funcionalidades

### 🎯 Principais
- **Transcrição Automática**: Converte áudios em texto usando IA avançada
- **Sessão Persistente**: Salva a sessão do WhatsApp localmente (sem QR Code repetido)
- **Otimização Inteligente**: Reduz tamanho do áudio antes do envio para economia
- **Suporte Multi-idioma**: Detecta automaticamente o idioma do áudio
- **Tratamento de Erros**: Sistema robusto de tratamento de falhas
- **Validação de Segurança**: Verifica tipos de arquivo e tamanhos antes do processamento

### 📱 Comandos Disponíveis
- `!ping` - Testa se o bot está funcionando
- **Áudio/Voz** - Transcreve automaticamente qualquer mensagem de áudio
- **Mensagens de Texto** - Envia mensagem de boas-vindas personalizada

## 🏗️ Arquitetura do Projeto

```
EuTranscrevo_bot_Whatsapp/
├── 📁 commands/           # Comandos do bot
│   ├── transcrever.js     # Processamento principal de áudio
│   ├── ping.js           # Comando de teste de funcionamento
│   └── boasVindas.js     # Mensagem de boas-vindas personalizada
├── 📁 services/          # Serviços externos
│   ├── audioOptimizer.js # Otimização com ffmpeg
│   └── replicateClient.js # Integração com API Replicate
├── 📁 utils/             # Utilitários
│   └── fileUtils.js      # Operações com arquivos
├── 📁 temp/              # Arquivos temporários
├── 📁 sessao-whatsapp/   # Sessão do WhatsApp (criada automaticamente)
├── main.js               # Arquivo principal do bot
├── config.js             # Centraliza todas as configurações do projeto
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
cd EuTranscrevo_bot_Whatsapp
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
module.exports = async function novoComando(message, client) {
  await client.sendMessage(message.from, 'Resposta do novo comando!');
  return true; // indica que o comando foi tratado
};
```

2. Registre no `main.js`
```javascript
const novoComando = require('./commands/novoComando');

// No evento de mensagem
const handled = await novoComando(message, client);
if (handled) return;
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
- Validação de tamanho de arquivo (máximo 50MB)
- Verificação de tipos MIME permitidos

### Tipos de Áudio Suportados
- `audio/mp3`
- `audio/wav`
- `audio/m4a`
- `audio/ogg`
- `audio/aac`
- `audio/webm`
- `audio/opus`
- `audio/amr`
- `audio/3gpp`
- `audio/mpeg`
- `audio/mp4`

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

### Fluxo de Processamento
1. **Recebimento**: Bot detecta mensagem de áudio
2. **Validação**: Verifica tipo e tamanho do arquivo
3. **Download**: Baixa o áudio da mensagem
4. **Otimização**: Reduz tamanho com ffmpeg
5. **Transcrição**: Envia para API Replicate
6. **Resposta**: Envia transcrição como resposta
7. **Limpeza**: Remove arquivos temporários

## 🐛 Solução de Problemas

### Problemas Comuns

**QR Code não aparece**
- Verifique se o WhatsApp está logado
- Delete a pasta `sessao-whatsapp/` e reinicie

**Erro de transcrição**
- Verifique se o token do Replicate está correto
- Confirme se o ffmpeg está instalado
- Verifique a conexão com a internet

**Erro de validação de arquivo**
- Verifique se o arquivo é realmente um áudio
- Confirme se o tamanho não excede 50MB
- Verifique se o tipo MIME está na lista permitida

**Erro de otimização de áudio**
- Verifique se o ffmpeg está instalado e no PATH
- Confirme se há espaço suficiente no disco
- Verifique as permissões de escrita no diretório temp

## 📦 Dependências

### Principais
- `whatsapp-web.js` - Cliente WhatsApp Web
- `axios` - Cliente HTTP para APIs
- `file-type` - Detecção de tipos de arquivo
- `qrcode-terminal` - Geração de QR Code no terminal
- `dotenv` - Gerenciamento de variáveis de ambiente

### Desenvolvimento
- `node-cron` - Agendamento de tarefas (para limpeza automática)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**parrelladev** - [GitHub](https://github.com/parrelladev)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
