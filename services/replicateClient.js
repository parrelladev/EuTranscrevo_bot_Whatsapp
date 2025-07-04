/**
 * 📡 CLIENTE PARA API REPLICATE
 * 
 * Este serviço integra com a API Replicate para transcrição de áudio:
 * - Envia arquivos de áudio para o modelo Whisper large-v3
 * - Gerencia o processo de polling para aguardar resultados
 * - Configura parâmetros otimizados para transcrição em português
 * - Trata erros de rede e timeout
 * 
 * @author parrelladev
 * @version 1.0.0
 */

const fs = require('fs');
const axios = require('axios');
const config = require('../config');
require('dotenv').config();

// Usar configurações:
const REPLICATE_TOKEN = config.replicate.token;
const MODEL_VERSION = config.replicate.modelVersion;

/**
 * Transcreve um arquivo de áudio usando a API Replicate
 * 
 * O processo funciona em duas etapas:
 * 1. Envia o áudio para processamento (cria uma previsão)
 * 2. Faz polling até o resultado estar pronto
 * 
 * @param {string} filePath - Caminho do arquivo de áudio a ser transcrito
 * @returns {Promise<string>} - Texto transcrito do áudio
 * 
 * @throws {Error} - Se houver erro na API ou timeout
 */
async function transcribeAudio(filePath) {
  try {
    // Converte o arquivo de áudio para base64
    const audioBase64 = fs.readFileSync(filePath).toString('base64');

    // ETAPA 1: Cria a previsão (envia o áudio para processamento)
    console.log('📤 Enviando áudio para o Replicate...');
    const prediction = await axios.post(
      `${config.replicate.baseUrl}/predictions`,
      {
        version: MODEL_VERSION,
        input: {
          // Dados do áudio em formato base64
          audio: `data:audio/mp3;base64,${audioBase64}`,
          
          // Configurações de transcrição do config
          ...config.replicate.transcription
        }        
      },
      {
        headers: {
          Authorization: `Token ${REPLICATE_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // ETAPA 2: Polling para aguardar o resultado
    let status = prediction.data.status;
    let output = prediction.data.output;
    const predictionId = prediction.data.id;

    console.log('⏳ Aguardando transcrição...');
    
    // Configurações de polling do config
    const { maxAttempts, interval } = config.replicate.polling;

    // Loop de polling até o resultado estar pronto
    let attempts = 0;
    while (status !== 'succeeded' && status !== 'failed' && attempts < maxAttempts) {
      // Aguarda o intervalo configurado antes da próxima verificação
      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;

      // Consulta o status da previsão
      const poll = await axios.get(`${config.replicate.baseUrl}/predictions/${predictionId}`, {
        headers: { Authorization: `Token ${REPLICATE_TOKEN}` }
      });

      status = poll.data.status;
      output = poll.data.output;
      
      console.log(`📊 Status: ${status} (tentativa ${attempts}/${maxAttempts})`);
    }

    // Verifica o resultado final
    if (status === 'succeeded') {
      const transcription = output?.transcription || '⚠️ Transcrição vazia.';
      console.log('✅ Transcrição concluída com sucesso!');
      return transcription;
    } else {
      throw new Error('Transcrição falhou no Replicate.');
    }
  } catch (err) {
    console.error('🔴 Erro no Replicate:', err.message);
    throw err;
  }
}

module.exports = { transcribeAudio };
