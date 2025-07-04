/**
 * 📁 UTILITÁRIOS PARA OPERAÇÕES COM ARQUIVOS
 * 
 * Este módulo contém funções auxiliares para:
 * - Validação de tipos de arquivo
 * - Limpeza de arquivos temporários
 * - Geração de nomes únicos
 * - Verificação de permissões
 * 
 * @author parrelladev
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const config = require('../config');

/**
 * Gera um nome único para arquivo temporário
 * 
 * @param {string} prefix - Prefixo do nome do arquivo (opcional, usa config se não informado)
 * @param {string} extension - Extensão do arquivo (ex: .mp3, .txt)
 * @returns {string} - Nome único do arquivo
 * 
 * @example
 * const fileName = generateUniqueFileName(); // Usa configurações padrão
 * const fileName = generateUniqueFileName('audio', '.mp3');
 * // Retorna: "audio_1703123456789.mp3"
 */
function generateUniqueFileName(prefix = null, extension = '') {
  const defaultPrefix = prefix || config.audio.tempPrefix;
  const timestamp = Date.now();
  return `${defaultPrefix}_${timestamp}${extension}`;
}

/**
 * Limpa arquivos temporários de um diretório
 * 
 * @param {string} directory - Caminho do diretório (opcional, usa config se não informado)
 * @param {string} pattern - Padrão de arquivos para deletar (ex: *.mp3)
 * @returns {Promise<number>} - Número de arquivos deletados
 * 
 * @example
 * const deletedCount = await cleanTempFiles(); // Usa configurações padrão
 * const deletedCount = await cleanTempFiles('./temp', '*.mp3');
 */
async function cleanTempFiles(directory = null, pattern = '*') {
  // Usa diretório padrão do config se não informado
  const targetDir = directory || path.join(os.tmpdir(), config.audio.tempPrefix);
  try {
    if (!fs.existsSync(targetDir)) {
      return 0;
    }

    const files = fs.readdirSync(targetDir);
    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(targetDir, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        // Verifica se o arquivo corresponde ao padrão
        if (pattern === '*' || file.endsWith(pattern.replace('*', ''))) {
          fs.unlinkSync(filePath);
          deletedCount++;
          console.log(`🗑️ Arquivo deletado: ${filePath}`);
        }
      }
    }

    return deletedCount;
  } catch (error) {
    console.error('❌ Erro ao limpar arquivos temporários:', error);
    return 0;
  }
}

/**
 * Verifica se um arquivo existe e é acessível
 * 
 * @param {string} filePath - Caminho do arquivo
 * @returns {boolean} - True se o arquivo existe e é acessível
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.accessSync(filePath, fs.constants.R_OK) === undefined;
  } catch (error) {
    return false;
  }
}

/**
 * Obtém o tamanho de um arquivo em bytes
 * 
 * @param {string} filePath - Caminho do arquivo
 * @returns {number} - Tamanho do arquivo em bytes
 * @throws {Error} - Se o arquivo não existir
 */
function getFileSize(filePath) {
  if (!fileExists(filePath)) {
    throw new Error(`Arquivo não encontrado: ${filePath}`);
  }
  
  const stats = fs.statSync(filePath);
  return stats.size;
}

/**
 * Cria um diretório se não existir
 * 
 * @param {string} dirPath - Caminho do diretório
 * @returns {boolean} - True se o diretório foi criado ou já existia
 */
function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Diretório criado: ${dirPath}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar diretório:', error);
    return false;
  }
}

module.exports = {
  generateUniqueFileName,
  cleanTempFiles,
  fileExists,
  getFileSize,
  ensureDirectoryExists
};
