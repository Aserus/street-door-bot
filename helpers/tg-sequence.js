import EventEmitter from 'node:events'



class TgSequence extends EventEmitter {}
const tgSequence = new TgSequence();



const sequenceAssoc = new Map()




export async function startSequence(chatId,command){
  sequenceAssoc.set(chatId,{
    name: command,
    args: []
  })
}
export async function pushSequence(chatId,value){
  const item = sequenceAssoc.get(chatId)
  if(!item) return;

  item.args.push(value)
  return true
}
export async function stopSequence(chatId){
  sequenceAssoc.delete(chatId)
}




export default tgSequence
