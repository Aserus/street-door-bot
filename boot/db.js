import path from 'path'
import mongoose from 'mongoose';
import fs from 'fs/promises'




async function importModels(){
	let modelList = await fs.readdir(path.join(process.cwd(),'/models'))
	modelList = modelList.filter(fn => path.extname(fn) === '.js')

	for(let modelFile of modelList){
		await import(`#models/${modelFile}`)
	}
}


export const start = async () => {
  const { MONGO_URL } = process.env
  if(!MONGO_URL) throw new Error('MONGO_URL is empty')
  
	await importModels()

	return await mongoose.connect(MONGO_URL);
}


export default start;