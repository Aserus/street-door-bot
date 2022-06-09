
import startBot from './bot/index.js'
import startDb from './db.js'

export default async ()=> {
  await startBot()
  await startDb()

}