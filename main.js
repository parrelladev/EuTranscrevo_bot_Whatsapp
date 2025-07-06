/**
 * 🤖 BOT DE TRANSCRIÇÃO DE ÁUDIO PARA WHATSAPP
 * 
 * Este é o arquivo principal do bot que:
 * - Conecta ao WhatsApp Web usando whatsapp-web.js
 * - Gerencia a sessão local do WhatsApp
 * - Processa mensagens recebidas
 * - Roteia comandos e áudios para as funções apropriadas
 * 
 * @author parrelladev
 * @version 1.0.0
 */

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa as dependências necessárias do whatsapp-web.js
const { Client, LocalAuth, MessageMedia, MessageTypes } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Importa as configurações centralizadas
const config = require('./config');

// Importa os módulos
const transcrever = require('./commands/transcrever');
const ping = require('./commands/ping');
const boasVindas = require('./commands/boasVindas');


/**
 * Configuração do cliente WhatsApp
 * 
 * LocalAuth: Salva a sessão localmente para não precisar escanear QR Code toda vez
 * clientId: Identificador único da sessão
 * dataPath: Diretório onde a sessão será salva
 * puppeteer: Configurações do navegador headless
 */
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: config.auth.clientId,
    dataPath: config.auth.dataPath,
  }),
  puppeteer: config.auth.puppeteer
});

/**
 * Evento: QR Code gerado
 * 
 * Quando o bot não tem uma sessão válida, gera um QR Code no terminal
 * para ser escaneado pelo WhatsApp
 */
client.on('qr', qr => qrcode.generate(qr, { small: true }));

/**
 * Evento: Cliente pronto
 * 
 * Executado quando o bot se conecta com sucesso ao WhatsApp
 */
client.on('ready', () => {
  console.log('✅ Cliente está pronto!');
  console.log(config.messages.welcome);
});

/**
 * Evento: Mensagem recebida
 * 
 * Processa todas as mensagens recebidas no WhatsApp
 * - Comandos de texto (como !ping)
 * - Mensagens de áudio para transcrição
 * 
 * @param {Object} message - Objeto da mensagem recebida
 */
client.on('message', async message => {
  try {
    // 👉 Verifica se é mídia de áudio ou voz
    const isAudio =
      message.hasMedia &&
      (message.type === MessageTypes.VOICE || message.type === MessageTypes.AUDIO);

    // 🎙️ Se for áudio, chama apenas o transcrever
    if (isAudio) {
      console.log('🎧 Áudio recebido!');
      await transcrever(message, client);
      return;
    }

    // 👋 Se não for áudio, envia mensagem de boas-vindas
    await boasVindas(message, client);

    // 🎯 Outros comandos, como !ping
    const handled = await ping(message, client);
    if (handled) return;

  } catch (err) {
    console.error('❌ Erro no processamento da mensagem:', err);
    await client.sendMessage(message.from, '⚠️ Ocorreu um erro inesperado. Tente novamente mais tarde.');
  }
});


// Inicializa o cliente WhatsApp
client.initialize();