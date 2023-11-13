const mongoose = require('mongoose');

const connectDb= async()=>{
    try{
      const resultado=  await mongoose.connect(process.env.DB_URL)
      console.log(`se conecto a la base de datos :'${resultado.connection.host}`)

    } catch(erro){console.log(erro)}}

module.exports=connectDb