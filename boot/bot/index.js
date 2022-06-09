
import { Telegraf }  from 'telegraf'
import fs from 'fs/promises'
import path from 'path'

async function importPlugins(bot){
	let list = await fs.readdir(path.join(process.cwd(),'/plugins'))
	list = list.filter(fn => path.extname(fn) === '.js')

	for(let fileName of list){
		const modul = await import(`#plugins/${fileName}`)
    await modul.default(bot)
	}
}

async function importCommands(bot){
	let list = await fs.readdir(path.join(process.cwd(),'/commands'))
	list = list.filter(fn => path.extname(fn) === '.js')

	for(let fileName of list){
		const modul = await import(`#commands/${fileName}`)
    await modul.default(bot)
	}
}





const start = async () => {
  const token = process.env.BOT_TOKEN;
  if(!token) throw new Error('BOT_TOKEN is empty')

  const bot = new Telegraf(token)

  await importPlugins(bot)  
  await importCommands(bot)  


  bot.launch()
  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}



export default start



