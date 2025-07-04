/**
 * 📌 COMANDO DE FUNCIONAMENTO
 * 
 * Este módulo fornece retorno caso o bot esteja disponível.
 * 
 * @author parrelladev
 * @version 1.0.0
 */

const config = require('../config');

module.exports = async function ping(message, client) {
  if (message.body === config.commands.ping) {
    await client.sendMessage(message.from, 'pong');
    return true; // indica que o comando foi tratado
  }
  return false;
};