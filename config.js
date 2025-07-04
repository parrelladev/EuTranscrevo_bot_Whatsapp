/**
 * ⚙️ CONFIGURAÇÕES CENTRALIZADAS DO BOT
 * 
 * Este arquivo centraliza todas as configurações do projeto,
 * facilitando a manutenção e customização.
 * 
 * @author Seu Nome
 * @version 1.0.0
 */

require('dotenv').config();

module.exports = {
  // 🔐 Configurações de Autenticação
  auth: {
    clientId: 'cliente-bot',
    dataPath: './sessao-whatsapp',
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  },

  // 🎛️ Configurações de Áudio
  audio: {
    // Parâmetros de otimização do ffmpeg
    optimization: {
      speed: 1.0,           // Velocidade de reprodução
      volume: 1.0,          // Volume do áudio
      bitrate: '32k',       // Bitrate para economia
      channels: 1,          // Mono (1 canal)
      format: 'mp3'         // Formato de saída
    },
    
    // Diretórios temporários
    tempDir: 'temp',
    tempPrefix: 'audio-transcribe'
  },

  // 📡 Configurações da API Replicate
  replicate: {
    token: process.env.REPLICATE_TOKEN,
    modelVersion: '3c08daf437fe359eb158a5123c395673f0a113dd8b4bd01ddce5936850e2a981',
    baseUrl: 'https://api.replicate.com/v1',
    
    // Parâmetros de transcrição
    transcription: {
      language: "auto",
      translate: false,
      temperature: 0,
      transcription: "plain text",
      suppress_tokens: "-1",
      logprob_threshold: -1,
      no_speech_threshold: 0.6,
      condition_on_previous_text: true,
      compression_ratio_threshold: 2.4,
      temperature_increment_on_fallback: 0.2
    },
    
    // Configurações de polling
    polling: {
      maxAttempts: 30,      // Máximo de tentativas
      interval: 2000,       // Intervalo entre tentativas (ms)
      timeout: 60000        // Timeout total (ms)
    }
  },

  // 📱 Comandos do Bot
  commands: {
    ping: '!ping',
  },

  // 📊 Configurações de Log
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableEmojis: true,
    enableTimestamps: true
  },

  // 🛡️ Configurações de Segurança
  security: {
    maxFileSize: 50 * 1024 * 1024,  // 50MB
    allowedAudioTypes: [
      'audio/mp3', 
      'audio/wav', 
      'audio/m4a', 
      'audio/ogg',
      'audio/ogg; codecs=opus',
      'audio/aac',
      'audio/webm',
      'audio/opus',
      'audio/amr',
      'audio/3gpp',
      'audio/mpeg',
      'audio/mp4'
    ],
    enableFileTypeValidation: true,
    autoCleanup: true
  },

  // ⚡ Configurações de Performance
  performance: {
    concurrentTranscriptions: 3,    // Máximo de transcrições simultâneas
    cleanupInterval: 300000,        // Limpeza a cada 5 minutos
    maxTempFiles: 100               // Máximo de arquivos temporários
  },

  // 🌐 Configurações de Rede
  network: {
    timeout: 30000,                 // Timeout de requisições (ms)
    retries: 3,                     // Número de tentativas
    retryDelay: 1000                // Delay entre tentativas (ms)
  },

  // 📝 Mensagens do Bot
  messages: {
    error: '❌ Ocorreu um erro inesperado. Tente novamente mais tarde.',
    audioError: '❌ Ocorreu um erro ao transcrever seu áudio.',
    invalidFile: '⚠️ O arquivo enviado não é um áudio válido.',
    success: '✅ Transcrição concluída!'
  },

  // 🔧 Configurações de Desenvolvimento
  development: {
    debug: process.env.NODE_ENV === 'development',
    enableVerboseLogs: process.env.NODE_ENV === 'development',
    mockTranscription: false,       // Para testes sem API
    skipFileTypeValidation: false   // Pular validação de tipo de arquivo (para debug)
  }
}; 