
import JSUser from '#models/user.js'
import PikApi from '#helpers/pikapi.js'



function arryToCol(array,size){
  // let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; //массив, можно использовать массив объектов
  let subarray = []; //массив в который будет выведен результат.
  for (let i = 0; i <Math.ceil(array.length/size); i++){
      subarray[i] = array.slice((i*size), (i*size) + size);
  }
  return subarray
}

async function fetchIntercom(user){
  const pik = new PikApi(user.pik.token,user.pik.uid)
  const list = await pik.intercomList()
  
  const intercomList = list.filter(item => item.relays.length>0)
  const buttons = []

  intercomList.forEach(intercom => {
    const item = intercom.relays[0]
    const isHidden = item.user_settings && item.user_settings.is_hidden
    if(isHidden) return;
    const text = (item.user_settings && item.user_settings.custom_name) ? item.user_settings.custom_name : item.name
    const isFavorite = !!(item.user_settings && item.user_settings.is_favorite)    
    const btn = {
      id: item.id,
      text,
      isFavorite,
      status: intercom.status
    }
    buttons.push(btn)
  })
  return buttons
}

async function contextList(ctx) {
    const user = await ctx.getUser()
    if(!user.pik || !user.pik.token) return ctx.reply('Вы не авторизовались')

     

    const intercomList = await fetchIntercom(user)
    const favoritList = intercomList.filter(item => item.isFavorite)
    const moreCount = intercomList.length - favoritList.length

    const currentList = favoritList.length ? favoritList : intercomList


    let inlineBtns = currentList.map(item =>{
      return {
        text: item.text,
        callback_data: `open_intercom_${item.id}`
      }
    })

    inlineBtns = arryToCol(inlineBtns,2)

    if(favoritList.length >0 && moreCount > 0){
      inlineBtns.push([{ text: 'Остальные...' , callback_data: 'intercom_more'}])
    }
    

    ctx.reply("Список домофонов:", {
        reply_markup: {
            inline_keyboard:inlineBtns
        }
    }); 
    
  }

export default (bot)=>{



 
  bot.command('/list', contextList)  
  bot.action('intercom_list', contextList)

  bot.action(/open_intercom_+/, async (ctx) => {
    const user = await ctx.getUser()
    ctx.answerCbQuery()
    if(!user) return ctx.reply('Вы не авторизованы')

    const intercomId = Number(ctx.update.callback_query.data.replace('open_intercom_',''))


    const pik = new PikApi(user.pik.token,user.pik.uid)
    await pik.intercomOpen(intercomId)
  })

  bot.action('intercom_more', async (ctx) => {
    const user = await ctx.getUser()
    ctx.answerCbQuery()

    if(!user) return ctx.reply('Вы не авторизованы')
    
    const intercomList = await fetchIntercom(user)



    let inlineBtns = intercomList.filter(item => !item.isFavorite).map(item =>{
      return {
        text: item.text,
        callback_data: `open_intercom_${item.id}`
      }
    })

    inlineBtns = arryToCol(inlineBtns,2)

    
    inlineBtns.push([{ text: 'Избранные...' , callback_data: 'intercom_list'}])
    
    ctx.reply("Список остальных домофонов:", {
        reply_markup: {
            inline_keyboard:inlineBtns
        }
    });


  })

  
}