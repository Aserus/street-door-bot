import JSUser from '#models/user.js'



export default bot => {

  bot.use((ctx, next) => {
    ctx.getUser = async (autoCreate) => {
      let chatId = null
      if(ctx.message && ctx.message.chat) chatId = ctx.message.chat.id
      else if (ctx.callback_query && ctx.callback_query.message && ctx.callback_query.message.chat) chatId = ctx.callback_query.message.chat.id
      else if (ctx.update.callback_query 
        && ctx.update.callback_query.message 
        && ctx.update.callback_query.message.chat) chatId = ctx.update.callback_query.message.chat.id
      if(!chatId) return null
      // console.log(ctx)
      let user = await JSUser.findOne({ chatId })
      if(user || !autoCreate) return user;

      user = new JSUser()
      user.username = ctx.message.from.username
      user.names = {}

      if(ctx.message.from.first_name) user.names.first = ctx.message.from.first_name
      if(ctx.message.from.second_name) user.names.second = ctx.message.from.second_name

      user.chatId = ctx.message.chat.id
      await user.save()
      return user
    }
    return next()
  })
}