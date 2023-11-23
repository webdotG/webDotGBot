const telegramApi = require('node-telegram-bot-api')
const TOKEN = '6365279526:AAFEi7m5sl5wc8D0eWj0u3IMQrym83e3xog'
const bot = new telegramApi(TOKEN, { polling: true })
const {luckyOption, restartLuckyOption} = require('/options.js')

const chats = {}


const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Я загадал цифру от 0 до 9, если угадаешь с меня пиво!`);
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Го ', luckyOption);
}

const start = () => {

  bot.setMyCommands([
    { command: '/start', description: 'приветствие !' },
    { command: '/info', description: 'что я знаю ?' },
    { command: '/lucky', description: 'сыграем на пиво ?' }
  ])

  bot.on('message', async (msg) => {
    console.log("MESSAGE! : ", msg)
    const text = msg.text
    const chatId = msg.chat.id

    try {
      if (text === '/start') {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b87/e56/b87e565b-9257-3883-9d15-43589148a887/192/16.webp')
        return bot.sendMessage(chatId, `Приветствую, я бот webDotG.`)
      }
      if (text === '/info') {
        return bot.sendMessage(chatId, `Я знаю что тебя зовут : ${msg.from.first_name}`)
      }
      if (text === '/lucky') {
        return startGame(chatId);
      } return bot.sendMessage(chatId, 'Я пока немного тупенький, выбери из того что я умею! ))');
    } catch (e) {
      return bot.sendMessage(chatId, 'Произошла какая то ошибочка!)');
    }
  
  }
  )

  bot.on('callback_query', async ( msg ) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/restartLucky') {
      return startGame(chatId)
    }
    const user = await UserModel.findOne({ chatId })
    if (data == chats[chatId]) {
      user.right += 1;
      await bot.sendMessage(chatId, `Поздравляю!  ты отгадал цифру ${chats[chatId]}`, restartLuckyOption);
    } else {
      user.wrong += 1;
      await bot.sendMessage(chatId, `Не угадал! я загадал цифру ${chats[chatId]}`, restartLuckyOption);
    }
    await user.save();
  })

}
start()
