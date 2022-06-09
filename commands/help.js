

const defaultCommandList = [
  '/help - Помощь',
  '/login - Войти в свой аккаунт',
  '/tokenupdate - вручную указать токен без телефона и пароля',
]
const authCommandList = [
  '/list - список домофонов',
]


const helpMsg = `*Список команд:*\n`+defaultCommandList.join('\n')

const authMsg = `*Для авторизованных пользователей:*\n`+authCommandList.join('\n')


export default (bot)=>{


  bot.start((ctx) => ctx.replyWithMarkdown('Используйте /help чтобы узнать все команды\n'+helpMsg))

  bot.help(async (ctx) => {
    let msg = helpMsg

    const user = await ctx.getUser()
    if(user) msg+='\n\n'+authMsg

    ctx.replyWithMarkdown(msg)
  })
  // bot.on('sticker', (ctx) => ctx.reply('👍'))
  // bot.hears('hi', (ctx) => ctx.reply('Hey there'))

}