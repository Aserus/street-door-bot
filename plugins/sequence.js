import tgSequence,{ startSequence,stopSequence,pushSequence } from '#helpers/tg-sequence.js'





export default bot => {
  bot.use(async (ctx, next) => {
    // stop sequence
    ctx.startSequence = async (command,fields,cb) => {
      
      startSequence(ctx.message.chat.id,command)
    }
    ctx.stopSequence = async () => {
      stopSequence(ctx.message.chat.id)
    }

    ctx.processSequence = async (command) => {
      const params = {
        ctx,
        args:command.args
      }
      tgSequence.emit(command.name,params)
    }
    await next()


    if(ctx.message && ctx.message.text.indexOf('/') != 0 && ctx.message.chat.id){
      const chatId = ctx.message.chat.id
      const { text } = ctx.message

      const res = await pushSequence(chatId,text)
      if(res){
        // nextField()
      }
    }

    

    return
  })



  bot.sequence = (name,fields,cb) => {


    bot.command(name,(ctx)=>{
      ctx.startSequence(name,fields,cb)

      ctx.reply(`Введите `+fields[0])
    })

    console.log(name,fields,cb)

  }
 

}