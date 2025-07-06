/**
 * 📝 MÓDULO DE TRANSCRIÇÃO DE ÁUDIO
 * 
 * Este módulo processa mensagens de áudio do WhatsApp:
 * 1. Baixa o áudio da mensagem
 * 2. Salva temporariamente no sistema
 * 3. Otimiza o áudio com ffmpeg
 * 4. Envia para transcrição via API Replicate
 * 5. Retorna a transcrição como resposta
 * 6. Limpa arquivos temporários
 * 
 * @author parrelladev
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const config = require('../config');

// Importa os serviços necessários
const { optimizeAudio } = require('../services/audioOptimizer');
const { transcribeAudio } = require('../services/replicateClient');
const { fileTypeFromFile } = require('file-type'); // Para verificar se é realmente um arquivo de áudio

/**
 * Função principal de transcrição
 * 
 * Processa uma mensagem de áudio do WhatsApp e retorna sua transcrição
 * 
 * @param {Object} message - Objeto da mensagem do WhatsApp
 * @param {Object} client - Cliente WhatsApp para enviar respostas
 * @returns {Promise<void>}
 */
module.exports = async function transcrever(message, client) {
  try {
    // Verifica se a mensagem contém mídia
    if (!message.hasMedia) return;

    // 🎧 Reage com um emoji
    await message.react('⏳');

    // Baixa a mídia da mensagem
    const media = await message.downloadMedia();
    if (!media || !media.data) {
      console.error('⚠️ Erro: Mídia inválida ou sem dados.');
      return message.reply(config.messages.audioError);
    }

    // Cria diretório temporário para processar o áudio
    const tempDir = path.join(os.tmpdir(), config.audio.tempPrefix);
    fs.mkdirSync(tempDir, { recursive: true });

    // Gera nomes únicos para os arquivos de áudio
    const baseName = `${Date.now()}`;
    const originalPath = path.join(tempDir, `${baseName}_original.${config.audio.optimization.format}`);
    const optimizedPath = path.join(tempDir, `${baseName}_optimized.${config.audio.optimization.format}`);

    // Salva o áudio original no disco
    fs.writeFileSync(originalPath, Buffer.from(media.data, 'base64'));
    console.log('📥 Áudio salvo:', originalPath);

    // Verifica se o arquivo é realmente um áudio válido
    // Isso previne processamento de arquivos maliciosos
    const fileType = await fileTypeFromFile(originalPath);

    // Logs de debug para entender o tipo de arquivo
    console.log('🔍 Tipo de arquivo detectado:', fileType);
    console.log('📋 Tipos permitidos:', config.security.allowedAudioTypes);

    // Pular validação se configurado para debug
    if (config.development.skipFileTypeValidation) {
      console.log('⚠️ Validação de tipo de arquivo desabilitada (modo debug)');
    } else {
      if (!fileType) {
        console.log('❌ Nenhum tipo de arquivo detectado');
        fs.unlinkSync(originalPath);
        return message.reply(config.messages.invalidFile);
      }

      if (!config.security.allowedAudioTypes.includes(fileType.mime)) {
        console.log(`❌ Tipo de arquivo não permitido: ${fileType.mime}`);
        fs.unlinkSync(originalPath);
        return message.reply(config.messages.invalidFile);
      }

      console.log(`✅ Tipo de arquivo válido: ${fileType.mime}`);
    }

    // Verifica o tamanho do arquivo
    const fileSize = fs.statSync(originalPath).size;
    console.log(`📏 Tamanho do arquivo: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);

    if (fileSize > config.security.maxFileSize) {
      fs.unlinkSync(originalPath);
      return message.reply('⚠️ Arquivo muito grande. Tamanho máximo: 50MB');
    }

    // Otimiza o áudio para reduzir tamanho e melhorar performance
    console.log('🎛️ Otimizando áudio...');
    await optimizeAudio(originalPath, optimizedPath);

    // Envia o áudio otimizado para transcrição
    const transcript = await transcribeAudio(optimizedPath);

    // Reage com "pronto" (✅)
    await message.react('✅');

    // Envia a transcrição como resposta
    await message.reply(`${transcript.trim()}`);
    console.log(`✅ Transcrição enviada:\n${transcript}`);

    // Limpa os arquivos temporários para economizar espaço
    fs.unlinkSync(originalPath);
    fs.unlinkSync(optimizedPath);

  } catch (err) {
    console.error('❌ Erro ao processar áudio:', err);
    await message.react('❌');
    await message.reply('❌ Ocorreu um erro ao transcrever seu áudio.');
  }
};
