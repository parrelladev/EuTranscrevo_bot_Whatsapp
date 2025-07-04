/**
 * 🎛️ SERVIÇO DE OTIMIZAÇÃO DE ÁUDIO
 * 
 * Este serviço utiliza o ffmpeg para otimizar arquivos de áudio antes da transcrição:
 * - Reduz a qualidade para economizar banda e custos da API
 * - Converte para mono (1 canal) para melhor performance
 * - Ajusta velocidade e volume conforme necessário
 * - Define bitrate baixo para arquivos menores
 * 
 * @author parrelladev
 * @version 1.0.0
 */

const { exec } = require('child_process');
const path = require('path');
const config = require('../config');

/**
 * Otimiza um arquivo de áudio usando ffmpeg
 * 
 * A otimização inclui:
 * - Conversão para mono (1 canal)
 * - Redução de bitrate para economia
 * - Ajuste de volume e velocidade
 * - Formato MP3 para compatibilidade
 * 
 * @param {string} inputPath - Caminho do arquivo de áudio original
 * @param {string} outputPath - Caminho onde salvar o áudio otimizado
 * @returns {Promise<boolean>} - True se a otimização foi bem-sucedida
 * 
 * @example
 * await optimizeAudio('audio.mp3', 'audio_otimizado.mp3');
 */
function optimizeAudio(inputPath, outputPath) {
  const { speed, volume, bitrate, channels } = config.audio.optimization;
  return new Promise((resolve, reject) => {
    // Filtros do ffmpeg para otimização:
    // - volume: ajusta o volume do áudio
    // - atempo: ajusta a velocidade sem distorcer o pitch
    const filters = `volume=${volume},atempo=${speed}`;

    // Comando ffmpeg completo:
    // -i: arquivo de entrada
    // -filter:a: aplica filtros de áudio
    // -ac: converte para mono (1 canal)
    // -b:a: define o bitrate
    // -y: sobrescreve arquivo de saída se existir
    const cmd = `ffmpeg -i "${inputPath}" -filter:a "${filters}" -ac ${channels} -b:a ${bitrate} -y "${outputPath}"`;

    // Executa o comando ffmpeg
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro no ffmpeg: ${stderr}`);
        return reject(error);
      }
      resolve(true);
    });
  });
}

module.exports = { optimizeAudio };
