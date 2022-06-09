



export default (bot)=>{

  bot.sequence('login',
    [
      'phone','password'
      // { 
      //   name: 'phone', 
      //   format: (value)=> value.trim(),
      //   validate: (value) => !!value
      // },
      // { 
      //   name: 'pwd',
      //   format: (value)=> value.trim(),
      // }      
    ],
    async event => {
    const { ctx,args } = event


    console.log('login args',args)
  })

  /*
 bot.command('login',  async (ctx) => {
    console.log('login')
    await ctx.startSequence('login')
    ctx.reply('Введите свой телефон в формате +79001234567')
    return;
    console.log(ctx.message.text)

    const arr = ctx.message.text.split(' ')
    if(arr.length != 3) return ctx.reply('Введите свой телефон в формате +79001234567')
   
    const phone = arr[1]
    const pwd = arr[2]    

    try{
      const user = await ctx.getUser(true) 

      // ------------
      const pik = new PikApi()
      await pik.login(phone,pwd,(user.pik && user.pik.uid) ? user.pik.uid : null)
      //------------
      const info = pik.tokenInfo()


      const now = dayjs()
      const expires = dayjs(info.expires)
      const expiresStr = expires.format('DD.MM.YYYY HH:mm:ss')
      const dayCount = expires.diff(now,'day')
   
      user.pik = info
      await user.save()   
      

      ctx.reply(`Получен токен\nСрок жизни: ${dayCount} дней (до ${expiresStr})\nТеперь вам доступны новые команды в /help`)
    }catch(err){
      console.log(err)
      ctx.reply(msgErrorLogin)
    }finally{
      ctx.tg.deleteMessage(ctx.chat.id, ctx.message.message_id)
    }    
  })

  */
}

