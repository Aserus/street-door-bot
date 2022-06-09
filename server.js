import dotenv from 'dotenv'
import startBoot from './boot/index.js'
dotenv.config()





startBoot()
.then(()=>console.log('Server started'))
.catch(err => {
  console.log(err)	
  process.exit(1)  
})

