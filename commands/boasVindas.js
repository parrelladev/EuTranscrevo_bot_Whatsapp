// commands/boasVindas.js
module.exports = async function boasVindas(message, client) {
    const chat = await message.getChat();
  
    if (!chat.isGroup) {
      const contact = await message.getContact();
      const firstName = contact.pushname?.split(' ')[0] || 'amigo';
  
      await client.sendMessage(
        message.from,
        `🎙️ Olá, ${firstName}! Mande um áudio para que eu possa transcrever.`
      );
    }
  };
  