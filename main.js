const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const tokenPath = path.join(__dirname, 'key/token.json');

let telegramToken = '';

try {
  const tokenData = fs.readFileSync(tokenPath, 'utf8');
  const tokenJson = JSON.parse(tokenData);
  telegramToken = tokenJson.telegramToken;
} catch (err) {
  console.error('Ошибка чтения токена из файла token.json:', err);
  process.exit(1);
}
const bot = new TelegramBot(telegramToken, { polling: true });


// Обработка команды старт вывод приветствия.
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = "¡Bienvenido! Soy un bot de cálculo de costo en español. Por favor, utiliza el comando /new para comenzar un nuevo cálculo.";
  bot.sendMessage(chatId, welcomeMessage);
});


bot.onText(/\/new/, (msg) => {
  const chatId = msg.chat.id;
  const initialMessage = "Cálculo del costo por 1 kilogramo. Por favor, introduce el precio en números.";
  bot.sendMessage(chatId, initialMessage).then(() => {
    bot.once('text', (msg) => {
      const pricePerGram = parseFloat(msg.text);
      if (isNaN(pricePerGram)) {
        console.error("Error: El valor ingresado no es un número.");
        return;
      }
      bot.sendMessage(chatId, "Por favor, introduce el peso del artículo en gramos.").then(() => {
        bot.once('text', (msg) => {
          const weightInGrams = parseFloat(msg.text);
          if (isNaN(weightInGrams)) {
            console.error("Error: El peso ingresado no es un número.");
            return;
          }
          const costPerKilogram = (pricePerGram / weightInGrams) * 1000;
          bot.sendMessage(chatId, `${costPerKilogram.toFixed(2)} por kilogramo`);
        });
      });
    });
  });
});

// Запуск бота
bot.on('polling_error', (error) => {
  console.error(error);
});