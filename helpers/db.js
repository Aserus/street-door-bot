import path from 'path'
import mongoose from 'mongoose';
import fs from 'fs/promises'







async function importModels(){
	let modelList = await fs.readdir('./models')
	modelList = modelList.filter(fn => path.extname(fn) === '.mjs')

	for(let modelFile of modelList){
		await import(`#models/${modelFile}`)
	}
}


export const connect = async () => {
  const { MONGO_URL } = process.env
  if(!MONGO_URL) throw new Error('MONGO_URL is empty')
  
	await importModels()
	const connectUrl = MONGO_URL
	return await mongoose.connect(connectUrl);
}


export default mongoose;